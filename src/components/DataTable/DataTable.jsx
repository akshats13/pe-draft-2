import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './DataTable.css';
import '../Tooltip/Tooltip.css';
import { FiMaximize, FiMinimize, FiTrash2, FiInfo } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const DataTable = () => {
  const [hierarchicalColumns, setHierarchicalColumns] = useState([]);
  const allFields = useMemo(() => hierarchicalColumns.flatMap(col => col.fields), [hierarchicalColumns]);

  const [data, setData] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const autosaveIntervalRef = useRef(null);
  const dataRef = useRef(data);
  const [visibleFields, setVisibleFields] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const initialLoadEffect = useRef(true);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const isFieldVisible = useCallback((field, rowData) => {
    if (!field.conditional) return true;
    
    try {
      const func = new Function('rowData', `return ${field.conditional}`);
      return func(rowData);
    } catch (e) {
      console.error('Error evaluating conditional', e);
      return true;
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
        const allVisibleFieldIds = new Set();
        data.forEach(rowData => {
        allFields.forEach(field => {
            if (isFieldVisible(field, rowData)) {
            allVisibleFieldIds.add(field.id);
            }
        });
        });

        const newVisibleFields = allFields.filter(field => allVisibleFieldIds.has(field.id));
        setVisibleFields(newVisibleFields);

        const newVisibleColumns = hierarchicalColumns.map(col => {
        const visibleFieldsInCol = col.fields.filter(field => allVisibleFieldIds.has(field.id));
        if (visibleFieldsInCol.length > 0) {
            return { ...col, fields: visibleFieldsInCol };
        }
        return null;
        }).filter(Boolean);

        setVisibleColumns(newVisibleColumns);
    }
  }, [data, allFields, isFieldVisible, hierarchicalColumns]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [draftRes, structureRes] = await Promise.all([
          fetch('/api/get_draft'),
          fetch('/api/census-data')
        ]);

        if (!structureRes.ok) throw new Error('Failed to load form structure');
        const fetchedColumns = await structureRes.json();
        setHierarchicalColumns(fetchedColumns);

        if (draftRes.ok) {
          const { data: draftData } = await draftRes.json();
          if (draftData && draftData.length > 0) {
            setData(draftData);
            toast.success('Previous draft loaded.');
            return;
          }
        }

        // If no draft or draft is empty, create a new table
        const fields = fetchedColumns.flatMap(col => col.fields);
        const initialData = Array(10).fill({}).map(() => {
          const rowData = {};
          fields.forEach(field => {
            rowData[field.id] = '';
          });
          return rowData;
        });
        setData(initialData);
        toast.success('Form structure loaded.');

      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Could not load form data. Please refresh.');
      }
    };
    
    if (initialLoadEffect.current) {
        loadInitialData();
        initialLoadEffect.current = false;
    }

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAutosaveEnabled) {
      autosaveIntervalRef.current = setInterval(() => {
        saveDraft(dataRef.current);
      }, 30000); // 30 seconds
    } else {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    }

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [isAutosaveEnabled]);

  const saveDraft = async (currentData) => {
    try {
      const response = await fetch('/api/save_draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: currentData }),
      });
      if (response.ok) {
        toast.success('Draft saved automatically!');
        return true;
      } else {
        throw new Error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Auto-save failed');
      return false;
    }
  };

  const handleFieldChange = (rowIndex, fieldId, value) => {
    setData(prev => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [fieldId]: value
      };
      return newData;
    });
  };

  const renderFieldType = (field, rowIndex, rowData) => {
    const value = rowData[field.id] || '';
    
    const commonProps = {
        value: value,
        onChange: (e) => handleFieldChange(rowIndex, field.id, e.target.value)
    };

    let inputElement;

    switch (field.type) {
        case 'text':
          inputElement = (
            <input
              type="text"
              {...commonProps}
              placeholder={field.placeholder}
            />
          );
          break;
        case 'number':
          inputElement = (
            <input
              type="number"
              {...commonProps}
              min={field.min}
              max={field.max}
            />
          );
          break;
        case 'select':
          inputElement = (
            <select {...commonProps}>
              <option value="">Select...</option>
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
          break;
        case 'date':
          inputElement = (
            <input
              type="date"
              {...commonProps}
            />
          );
          break;
        default:
          inputElement = <input type="text" {...commonProps} />;
          break;
      }

    return (
        <div className="input-wrapper">
            {inputElement}
            {field.description && (
                <div className="tooltip">
                    <FiInfo color="#666" />
                    <span className="tooltiptext">{field.description}</span>
                </div>
            )}
        </div>
    );
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        const initialData = Array(10).fill({}).map(() => {
            const rowData = {};
            allFields.forEach(field => {
              rowData[field.id] = '';
            });
            return rowData;
          });
      setData(initialData);
      localStorage.removeItem('censusData');
      toast.success('Data has been reset.');
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit? This action is final.')) {
      try {
          const response = await fetch('/api/submit', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: dataRef.current }),
          });

          if (response.ok) {
              setIsSubmitted(true);
              setIsAutosaveEnabled(false);
              localStorage.removeItem('censusData');
              toast.success('Data submitted successfully!');
          } else {
              throw new Error('Submission failed');
          }
      } catch (error) {
          console.error('Submission failed:', error);
          toast.error('Submission failed. Please try again.');
      }
    }
  }

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);
  const toggleAutosave = () => setIsAutosaveEnabled(prev => !prev);

  const headerRows = useMemo(() => {
    const topRow = [];
    const bottomRow = [];

    visibleColumns.forEach((col, colIndex) => {
      const hasLabel = col.fields.length > 1 || (col.fields.length === 1 && col.fields[0].label);

      if (hasLabel) {
        // This is a multi-field column or a single field with a label.
        topRow.push(
          <th key={`${col.title}-${colIndex}`} colSpan={col.fields.length}>
            {col.title}
          </th>
        );
        col.fields.forEach(field => {
          bottomRow.push(<th key={field.id}>{field.label}</th>);
        });
      } else {
        // This is a single field column without a label, so we use the column's title.
        topRow.push(
          <th key={`${col.title}-${colIndex}`} rowSpan={2}>
            {col.title}
          </th>
        );
      }
    });

    return { topRow, bottomRow };
  }, [visibleColumns]);

  const lastFieldIds = useMemo(() => {
    const ids = new Set();
    visibleColumns.forEach(col => {
      if (col.fields.length > 0) {
        ids.add(col.fields[col.fields.length - 1].id);
      }
    });
    return ids;
  }, [visibleColumns]);


  if (isSubmitted) {
    return (
        <div className="submission-success">
            <h2>Thank You!</h2>
            <p>Your data has been successfully submitted.</p>
        </div>
    )
  }

  return (
    <div className={`datatable-container ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className="toolbar">
        <button onClick={toggleFullScreen}>
          {isFullScreen ? <FiMinimize /> : <FiMaximize />}
        </button>
        <div className='autosave-toggle'>
            <label className="switch">
                <input type="checkbox" checked={isAutosaveEnabled} onChange={toggleAutosave} />
                <span className="slider round"></span>
            </label>
            <span className='autosave-label'>Autosave</span>
        </div>
        <button onClick={resetData} className="danger">
          <FiTrash2 />
        </button>
      </div>
      <div className="table-wrapper">
      <table>
          <thead>
            <tr>{headerRows.topRow}</tr>
            {headerRows.bottomRow.length > 0 && <tr>{headerRows.bottomRow}</tr>}
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {visibleFields.map((field) => (
                  <td 
                    key={field.id}
                    className={`${lastFieldIds.has(field.id) ? 'main-question-border' : ''}`}>
                    {isFieldVisible(field, row) ? 
                      renderFieldType(field, rowIndex, row) : 
                      <span className="field-hidden">-</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='footer-toolbar'>
        <button onClick={handleSubmit} className='submit-btn'>
            Submit Final Data
        </button>
      </div>
    </div>
  );
};

export default DataTable;

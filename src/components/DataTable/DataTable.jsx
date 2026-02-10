import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './DataTable.css';
import { hierarchicalColumns } from './hierarchicalColumns.js';
import { FiMaximize, FiMinimize, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const DataTable = () => {
  const allFields = useMemo(() => hierarchicalColumns.flatMap(col => col.fields), []);

  const [data, setData] = useState(() => {
    const initialData = Array(10).fill({}).map(() => {
      const rowData = {};
      allFields.forEach(field => {
        rowData[field.id] = '';
      });
      return rowData;
    });
    return initialData;
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const autosaveIntervalRef = useRef(null);
  const dataRef = useRef(data);
  const [visibleFields, setVisibleFields] = useState(allFields);
  const [visibleColumns, setVisibleColumns] = useState(hierarchicalColumns);

  useEffect(() => {
      dataRef.current = data;
  }, [data]);

  const isFieldVisible = useCallback((field, rowData) => {
    if (!field.conditional) return true;
    if (typeof field.conditional === 'function') {
      return field.conditional(rowData);
    }
    return true;
  }, []);

  useEffect(() => {
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
  }, [data, allFields, isFieldVisible]);


  useEffect(() => {
    const loadDraft = async () => {
        try {
            const response = await fetch('/api/get_draft');
            if (response.ok) {
                const draftData = await response.json();
                if (draftData && draftData.length > 0) {
                    setData(draftData);
                    toast.success('Previously saved draft loaded.');
                }
            }
        } catch (error) {
            console.error('Error loading draft:', error);
            const savedData = localStorage.getItem('censusData');
            if (savedData) {
              try {
                const parsedData = JSON.parse(savedData);
                if (Array.isArray(parsedData)) {
                  setData(parsedData);
                }
              } catch (e) {
                console.error('Error parsing census data from localStorage', e);
              }
            }
        }
    };

    loadDraft();

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
    switch (field.type) {
        case 'text':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(rowIndex, field.id, e.target.value)}
              placeholder={field.placeholder}
            />
          );
        case 'number':
          return (
            <input
              type="number"
              value={value}
              min={field.min}
              max={field.max}
              onChange={(e) => handleFieldChange(rowIndex, field.id, e.target.value)}
            />
          );
        case 'select':
          return (
            <select
              value={value}
              onChange={(e) => handleFieldChange(rowIndex, field.id, e.target.value)}
            >
              <option value="">Select...</option>
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        case 'date':
          return (
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(rowIndex, field.id, e.target.value)}
            />
          );
        default:
          return <input type="text" value={value} onChange={(e) => handleFieldChange(rowIndex, field.id, e.target.value)} />;
      }
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

  if (isSubmitted) {
    return (
        <div className="submission-success">
            <h2>Thank You!</h2>
            <p>Your data has been successfully submitted.</p>
        </div>
    )
  }

  const lastFieldIds = new Set(
    visibleColumns.map(col => col.fields[col.fields.length - 1].id)
  );

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
            <tr>
              {visibleColumns.map((col, index) => (
                <th key={index} colSpan={col.fields.length}>
                  {col.title}
                </th>
              ))}
            </tr>
            <tr>
                {visibleFields.map((field, index) => (
                    <th key={index}>{field.label}</th>
                ))}
            </tr>
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

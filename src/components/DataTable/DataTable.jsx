import React from 'react';
import './DataTable.css';

const columns = [
  { title: 'Line No', type: 'text', hint: '' },
  { title: 'Building Number', type: 'text', hint: 'Only alphabets, digits and @#&A.()- are allowed' },
  { title: 'Census House Number', type: 'number', hint: 'Only numbers are allowed' },
  { title: 'Floor Material', type: 'text', hint: 'Only numbers are allowed' },
  { title: 'Wall Material', type: 'text', hint: 'Only numbers are allowed' },
  { title: 'Roof Material', type: 'text', hint: 'Only numbers are allowed' },
  { title: 'Use of Census house', type: 'text', hint: 'Only numbers are allowed' },
  { title: 'Column 8', type: 'text', hint: '' },
  { title: 'Column 9', type: 'text', hint: '' },
  { title: 'Column 10', type: 'text', hint: '' },
  { title: 'Column 11', type: 'text', hint: '' },
  { title: 'Column 12', type: 'text', hint: '' },
  { title: 'Column 13', type: 'text', hint: '' },
  { title: 'Column 14', type: 'text', hint: '' },
  { title: 'Column 15', type: 'text', hint: '' },
  { title: 'Column 16', type: 'text', hint: '' },
  { title: 'Column 17', type: 'text', hint: '' },
  { title: 'Column 18', type: 'text', hint: '' },
  { title: 'Column 19', type: 'text', hint: '' },
  { title: 'Column 20', type: 'text', hint: '' },
  { title: 'Column 21', type: 'text', hint: '' },
  { title: 'Column 22', type: 'text', hint: '' },
  { title: 'Column 23', type: 'text', hint: '' },
  { title: 'Column 24', type: 'text', hint: '' },
  { title: 'Column 25', type: 'text', hint: '' },
  { title: 'Column 26', type: 'text', hint: '' },
  { title: 'Column 27', type: 'text', hint: '' },
  { title: 'Column 28', type: 'text', hint: '' },
];

const DataTable = ({ height }) => {
  return (
    <div className="data-table-container" style={{ height: `${height}px` }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.title === 'Line No' ? (
                    <div className="line-no">{rowIndex + 1}</div>
                  ) : (
                    <div className="input-container">
                      <input type={col.type} />
                      {col.hint && <small className="hint">{col.hint}</small>}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './DataTable.css';

const columns = [
  { 
    title: 'Line No', 
    type: 'text', 
    hint: '',
    counter: 'lineNo'
  },
  { 
    title: 'Name of the person', 
    hint: 'Only alphabets, digits and @#&A.()- are allowed',
    counter: 'buildingNumber'
  },
  { 
    title: 'Relationship to head',
    hint: 'Only numbers are allowed',
    counter: 'censusHouseNumber'
  },
  { 
    title: 'Sex',
    type: 'text', 
    hint: 'Only numbers are allowed',
    counter: 'floorMaterial'
  },
  { 
    title: 'Date of birth and age', 
    type: 'text', 
    hint: 'Only numbers are allowed',
    counter: 'wallMaterial'
  },
  { 
    title: 'Current Marital Status',
    type: 'text', 
    hint: 'Only numbers are allowed',
    counter: 'roofMaterial'
  },
  { 
    title: 'Age at Marriage',
    type: 'text', 
    hint: 'Only numbers are allowed',
    counter: 'useOfCensusHouse'
  },
  { 
    title: 'Religion', 
    type: 'text', 
    hint: 'Only numbers are allowed',
    counter: 'actualUseOfCensusHouse'
  },
  { 
    title: 'SC/ST', 
    type: 'text', 
    hint: '',
    counter: 'conditionOfCensusHouse'
  },
  { 
    title: 'Mother Tongue', 
    type: 'text', 
    hint: '',
    counter: 'householdNumber'
  },
  { 
    title: 'Literacy Status', 
    type: 'text', 
    hint: '',
    counter: 'headOfHousehold'
  },
  { 
    title: 'Status of Attendance', 
    type: 'text', 
    hint: '',
    counter: 'sex'
  },
  { 
    title: 'Highest Educational Level Attained', 
    type: 'text', 
    hint: '',
    counter: 'numberOfMembers'
  },
  { 
    title: 'Worked anytime during last year', 
    type: 'text', 
    hint: '',
    counter: 'caste'
  },
  { 
    title: 'Category of economic activity', 
    type: 'text', 
    hint: '',
    counter: 'religion'
  },
  { 
    title: 'Occupation', 
    type: 'text', 
    hint: '',
    counter: 'ownershipStatus'
  },
  { 
    title: 'Name of industry', 
    type: 'text', 
    hint: '',
    counter: 'numberOfDwellingRooms'
  },
  { 
    title: 'Class of Worker', 
    type: 'text', 
    hint: '',
    counter: 'sourceOfDrinkingWater'
  },
  { 
    title: 'Economic Activity', 
    type: 'text', 
    hint: '',
    counter: 'availabilityOfKitchen'
  },
  { 
    title: 'Seeking or Avaialble for work', 
    type: 'text', 
    hint: '',
    counter: 'fuelUsedForCooking'
  },
  { 
    title: 'Birth Place', 
    type: 'text', 
    hint: '',
    counter: 'latrineWithinPremises'
  },
  { 
    title: 'Place of last attendance', 
    type: 'text', 
    hint: '',
    counter: 'typeOfLatrine'
  },
  { 
    title: 'Time of Migration', 
    type: 'text', 
    hint: '',
    counter: 'wasteWaterOutlet'
  },
  { 
    title: 'Reason', 
    type: 'text', 
    hint: '',
    counter: 'bathingFacility'
  },
  { 
    title: 'Duration of Stay', 
    type: 'text', 
    hint: '',
    counter: 'availabilityOfRadio'
  },
  { 
    title: 'Children Surviving', 
    type: 'text', 
    hint: '',
    counter: 'availabilityOfTelevision'
  },
  { 
    title: 'Children Ever Born', 
    type: 'text', 
    hint: '',
    counter: 'accessToInternet'
  },
  { 
    title: 'Children Born Alive', 
    type: 'text', 
    hint: '',
    counter: 'modeOfTransport'
  },
  { 
    title: 'Column 28', 
    type: 'text', 
    hint: '',
    counter: '' // No corresponding counter in second table
  },
];

const DataTable = forwardRef(({ height }, ref) => {
  const [data, setData] = useState(Array(10).fill({}).map(() => ({})));

  const handleChange = (rowIndex, colTitle, value) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [colTitle]: value };
    setData(newData);
  };

  useImperativeHandle(ref, () => ({
    getData: () => {
      return data;
    },
  }));

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
                      <input
                        type={col.type}
                        onChange={(e) => handleChange(rowIndex, col.title, e.target.value)}
                      />
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
});

export default DataTable;

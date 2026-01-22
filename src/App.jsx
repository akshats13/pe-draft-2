import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header/Header';
import LocationDetails from './components/LocationDetails/LocationDetails';
import DataTable from './components/DataTable/DataTable';
import './App.css';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const appRef = useRef(null);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    const updateTableHeight = () => {
      if (isSubmitted && appRef.current) {
        const header = appRef.current.querySelector('.header');
        const locationDetails = appRef.current.querySelector('.location-details');
        const title = appRef.current.querySelector('.title-style');

        const headerHeight = header?.offsetHeight || 0;
        const locationDetailsHeight = locationDetails?.offsetHeight || 0;
        const titleHeight = title?.offsetHeight || 0;
        
        const mainContentPaddingTop = 20;
        const wrapperMarginTop = 20;
        const appPadding = 32; // 1rem * 2 (top and bottom)

        const totalUsedSpace = headerHeight + locationDetailsHeight + titleHeight + mainContentPaddingTop + wrapperMarginTop + appPadding;

        const availableHeight = window.innerHeight - totalUsedSpace;

        setTableHeight(availableHeight > 200 ? availableHeight : 200); // Minimum height
      }
    };

    const timer = setTimeout(updateTableHeight, 50);
    window.addEventListener('resize', updateTableHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTableHeight);
    };
  }, [isSubmitted]);

  return (
    <div className="App" ref={appRef}>
      <Header />
      <div className="main-content">
        <LocationDetails onSubmit={handleSubmit} isSubmitted={isSubmitted} />
        {isSubmitted && (
          <div className="data-table-wrapper">
            <h2 className="title-style">Personal Enumeration</h2>
            <DataTable height={tableHeight} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header/Header';
import LocationDetails from './components/LocationDetails/LocationDetails';
import DataTable from './components/DataTable/DataTable';
import Footer from './components/Footer/Footer';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const [fileVersion, setFileVersion] = useState(0);
  const appRef = useRef(null);
  const dataTableRef = useRef(null);

  const handleLocationSubmit = () => {
    setIsSubmitted(true);
  };

  const handleDataSubmit = async () => {
    const data = dataTableRef.current.getData();
    const newVersion = fileVersion + 1;
    setFileVersion(newVersion);

    try {
      const response = await fetch('/api/save_record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, version: newVersion }),
      });

      if (response.ok) {
        toast.success('Record saved successfully!');
      } else {
        toast.error('Error saving record');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Error saving record');
    }
  };

  useEffect(() => {
    const updateTableHeight = () => {
      if (isSubmitted && appRef.current) {
        const header = appRef.current.querySelector('.header');
        const locationDetails = appRef.current.querySelector('.location-details');
        const title = appRef.current.querySelector('.title-style');
        const footer = appRef.current.querySelector('.footer');

        const headerHeight = header?.offsetHeight || 0;
        const locationDetailsHeight = locationDetails?.offsetHeight || 0;
        const titleHeight = title?.offsetHeight || 0;
        const footerHeight = footer?.offsetHeight || 0;
        
        const mainContentPaddingTop = 20;
        const wrapperMarginTop = 20;
        const appPadding = 32; // 1rem * 2 (top and bottom)

        const totalUsedSpace = headerHeight + locationDetailsHeight + titleHeight + footerHeight + mainContentPaddingTop + wrapperMarginTop + appPadding;

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
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <div className="main-content">
        <LocationDetails onSubmit={handleLocationSubmit} isSubmitted={isSubmitted} />
        {isSubmitted && (
          <div className="data-table-wrapper">
            <h2 className="title-style">Houselisting Block</h2>
            <DataTable ref={dataTableRef} height={tableHeight} />
            <Footer onSubmit={handleDataSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

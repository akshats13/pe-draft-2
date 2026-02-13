# Project Blueprint

## Overview
This is a web application for census data collection. It features a form for location details and a data table for personal enumeration. The application is built with React and uses a Node.js server for data handling.

## Implemented Features
*   **Location Details:** A form to enter location information (State, District, Tehsil, Town).
*   **Personal Enumeration:** A data grid for entering detailed personal information for multiple individuals.
*   **Draft Mode:** The application automatically saves progress and can resume from a draft.
*   **Data Persistence:** A Node.js/Express backend saves draft and final data to the file system.
*   **Vite Proxy:** The Vite development server is configured to proxy API requests to the backend.
*   **Styling:** The application has a clean, modern interface with custom CSS.
*   **Dynamic Table Headers:** The data table headers are now dynamically rendered based on the columns that are visible across all rows. This ensures a stable and intuitive table layout.
*   **Religion Dropdown:** The "Religion" column in the data table has been changed from a text input to a dropdown with predefined options. An "Others" option reveals a text input for manual entry.
*   **Q23 Last Residence Fix:** Corrected duplicate IDs in the "Last Residence" section (Q23) to ensure all sub-questions render correctly.
*   **Hierarchical Column Rendering:** The data table's header has been corrected to properly render hierarchical columns. Single-field columns now correctly display with a `rowSpan` of 2, creating a unified header cell, while multi-field columns have a two-level header with `colSpan`.
*   **UI Refinements and Workflow Automation:**
    *   Removed the default focus outline from all interactive elements.
    *   Simplified the `LocationDetails` component by making all fields visible by default.
    *   Automated the loading of the `DataTable` component on page load.
*   **Expanded `census-data.json`:** Expanded the `census-data.json` file to include validation, conditional visibility, descriptions, and more field types.

## Current Plan: Revert Marital Status to Dropdown

The "Marital Status" question (Q5) will be reverted from a radio button group back to a dropdown (`select`) to match the original design. The "Separated" option will be re-introduced.

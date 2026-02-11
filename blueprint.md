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

## Current Plan: UI Refinements and Workflow Automation

The following changes have been implemented to streamline the user experience:

1.  **Remove Focus Outline:** A global CSS rule (`*:focus { outline: none; }`) has been added to `src/App.css` to remove the default blue focus outline from all interactive elements, providing a cleaner look.

2.  **Simplify Location Details Component:**
    *   The `LocationDetails.jsx` component has been modified to remove the sequential, hierarchical appearance of the input fields. All four location fields (State, District, Tehsil, Town) are now visible by default when the component loads.
    *   The arrow button used to submit the location details has been removed.

3.  **Automate Data Table Loading:**
    *   The `App.jsx` component has been updated to load the `DataTable` component automatically on page load, rather than waiting for the location details to be submitted.
    *   The `isLocationSubmitted` state and related logic (`handleLocationSubmit` function, `useEffect` hook for checking drafts) have been removed, as the data table is now always present.

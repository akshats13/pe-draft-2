# Project Blueprint: Census Data Entry Form

## Overview

This document outlines the plan for creating a web-based data entry form that mirrors the "Census of India 2021 Household Schedule." The application will be built using React and will feature a modern, responsive design with a horizontally scrollable data entry section.

## Current Goal: Seventh Iteration

This iteration focuses on implementing a temporary data storage solution. Each time a user submits the data from the data table, the system will create a temporary file in a `temp_records` directory and save the record as a JSON file. The system will also manage file versions within a single session, creating a new file for each submission (e.g., `record_v1.json`, `record_v2.json`).

## Plan

1.  **Create a `temp_records` directory:**
    -   This directory will store all the temporary record files.
2.  **Create a simple Express server:**
    -   A new file, `src/server.js`, will be created to define a simple Express server.
    -   This server will have an endpoint, `/api/save_record`, that will receive the data from the frontend and save it to a file in the `temp_records` directory.
3.  **Update `vite.config.js`:**
    -   Configure Vite to proxy API requests to the Express server in development.
4.  **Update `src/App.jsx`:**
    -   Add a state variable to keep track of the file version.
    -   Modify the `handleDataSubmit` function to send a POST request to the `/api/save_record` endpoint with the data from the data table.
5.  **Update `src/components/DataTable/DataTable.jsx`:**
    -   Use the `useImperativeHandle` hook to expose a function that returns the data from the data table.
6.  **Update `src/App.jsx` to use a `ref`:**
    -   Use a `ref` to access the `DataTable` component's data from the `App` component.
7.  **Review and Refine:**
    -   Lint the code and verify all visual and functional changes in the application preview.

# Task_management

## Author
- **Subria Islam**

## Overview
This Task Management App allows users to manage tasks and tags effectively. Users can filter, add, modify, and remove tasks. The app provides features for activating tasks and tags, filtering tasks based on time intervals, and customizing the app's UI.


## Features

### Home View
- View all tasks and tags.
- Filter tasks by selecting specific tags.
- **Add New Task**: Allows users to create new tasks and tags.
- **Edit Task**: Users can modify task names and add new tags.
- **Remove Task**: Easily remove tasks with the click of a button.
- **Active Task/Tags**: Activate tasks and individual tags by clicking the "Active" button.

### About View
- Provides instructions about the app and related information.

### Filter Tasks
- **Filter by Time**: Users can filter tasks and tags based on a specific start and end time, showing all tasks that have been active during that interval.
- **Total Active Time**: View total active time (in minutes) for individual tasks or tags within the selected observation interval.

### Settings
- **Choose Color**: Customize the UI by selecting your favorite color.
- **Choose Mode**: 
  - **Default Mode**: Multiple tasks can be active at once.
  - **Alternative Mode**: Only one task can be active at a time.

## Installation and Setup

### Prerequisites
- **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Steps to Run

1. **Install Dependencies**:
   First, navigate to your project directory and run the following command to install all necessary dependencies:
   ```bash
   npm install
2. **Start JSON Server**:
   Start the backend server using the json-server. This will serve the db.json file as your backend data source:
   ```bash
   npx json-server -H localhost -p 3010 -w ./db.json
3. **Start the Application**:
   Finally, start the app by running the following command:
   ```bash
   npm start
  This will run the app in development mode, and it will be accessible in your browser at: http://localhost:3000.

## Technologies and Libraries Used
  - React.js: JavaScript library for building the user interface.
  - react-select/creatable: A MIT-licensed library used to create and select tags.
  - react-drag-reorder: A MIT-licensed library that allows drag-and-drop reordering of items.
  - moment: A MIT-licensed library used for handling dates and times.  
  
## License
This project is licensed under the **MIT License**.

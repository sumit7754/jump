# Full-Stack Application Architecture

This document provides a comprehensive overview of the project architecture to help developers build on top of this template.

## Overview

This is a minimal full-stack application with:
- **Backend**: Node.js with Express and SQLite
- **Frontend**: React with Vite

The application follows a clean separation between frontend and backend, communicating via REST API calls.

## Project Structure

```
project-root/
├── server/                  # Backend server
│   ├── controllers/         # Business logic
│   │   └── sampleController.js
│   ├── routes/              # API route definitions
│   │   └── sample.js
│   ├── db.js                # SQLite database setup and connection
│   ├── index.js             # Express server entry point
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
└── client/                  # Frontend React application
    ├── public/              # Static assets
    ├── src/                 # React source code
    │   ├── App.jsx          # Main React component
    │   └── main.jsx         # React entry point
    ├── index.html           # HTML template
    ├── vite.config.js       # Vite configuration
    └── package.json         # Frontend dependencies
```

## Backend Architecture

### Express Server (server/index.js)

The main entry point sets up:
- Express application initialization
- Middleware configuration (CORS, JSON parsing)
- API route registration
- Server startup

### Database (server/db.js)

Handles:
- SQLite connection using better-sqlite3
- Database initialization
- Table creation
- Initial data seeding

### Routes (server/routes/)

Each route file defines a set of API endpoints for a specific resource:
- `sample.js` - Routes for sample items

### Controllers (server/controllers/)

Contains the business logic that is executed when routes are accessed:
- `sampleController.js` - Logic for handling sample item operations

## Frontend Architecture

### Entry Point (client/src/main.jsx)

Sets up the React application and renders the root component.

### Main Component (client/src/App.jsx)

The main React component that:
- Fetches data from the backend API
- Manages loading and error states
- Renders UI based on fetched data

### Configuration (client/vite.config.js)

Configures Vite for:
- React plugin
- Development server port (5173)

## Data Flow

1. Express server provides API endpoints
2. React frontend fetches data from these endpoints
3. API responses are used to update React component state
4. UI renders based on the current state

## How to Extend

### Adding New Backend Features

1. **Create a new database table**:
   - Extend the `initDb()` function in `db.js`

   ```javascript
   function initDb() {
     // Existing code...
     
     // Add new table
     const createNewTableQuery = `
       CREATE TABLE IF NOT EXISTS new_items (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         description TEXT
       )
     `;
     
     db.exec(createNewTableQuery);
     
     // Seed new table if needed
     const newCount = db.prepare('SELECT COUNT(*) as count FROM new_items').get();
     if (newCount.count === 0) {
       const insert = db.prepare('INSERT INTO new_items (name, description) VALUES (?, ?)');
       insert.run('New Item', 'Description of new item');
     }
   }
   ```

2. **Create a new controller**:
   - Create `controllers/newController.js`

   ```javascript
   const db = require('../db');

   exports.getAllItems = async (req, res) => {
     try {
       const items = db.prepare('SELECT * FROM new_items').all();
       res.json(items);
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Server error' });
     }
   };

   exports.getItemById = async (req, res) => {
     try {
       const { id } = req.params;
       const item = db.prepare('SELECT * FROM new_items WHERE id = ?').get(id);
       
       if (!item) {
         return res.status(404).json({ error: 'Item not found' });
       }
       
       res.json(item);
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Server error' });
     }
   };

   exports.createItem = async (req, res) => {
     try {
       const { name, description } = req.body;
       const insert = db.prepare('INSERT INTO new_items (name, description) VALUES (?, ?)');
       const result = insert.run(name, description);
       
       res.status(201).json({ 
         id: result.lastInsertRowid,
         name, 
         description 
       });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Server error' });
     }
   };
   ```

3. **Create new routes**:
   - Create `routes/new.js`

   ```javascript
   const express = require('express');
   const router = express.Router();
   const newController = require('../controllers/newController');

   router.get('/new-items', newController.getAllItems);
   router.get('/new-items/:id', newController.getItemById);
   router.post('/new-items', newController.createItem);

   module.exports = router;
   ```

4. **Register the new routes in index.js**:

   ```javascript
   // Import routes
   const sampleRoutes = require('./routes/sample');
   const newRoutes = require('./routes/new');

   // Use routes
   app.use('/api', sampleRoutes);
   app.use('/api', newRoutes);
   ```

### Adding New Frontend Features

1. **Create new components**:
   - Create `src/components/` directory
   - Add component files like `NewItemList.jsx`, `NewItemForm.jsx`

   ```jsx
   // src/components/NewItemList.jsx
   import { useState, useEffect } from 'react';

   function NewItemList() {
     const [items, setItems] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await fetch('http://localhost:5000/api/new-items');
           
           if (!response.ok) {
             throw new Error('Network response was not ok');
           }
           
           const data = await response.json();
           setItems(data);
           setLoading(false);
         } catch (err) {
           setError(err.message);
           setLoading(false);
         }
       };

       fetchData();
     }, []);

     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error}</div>;

     return (
       <div>
         <h2>New Items</h2>
         <ul>
           {items.map(item => (
             <li key={item.id}>
               <h3>{item.name}</h3>
               <p>{item.description}</p>
             </li>
           ))}
         </ul>
       </div>
     );
   }

   export default NewItemList;
   ```

2. **Update App.jsx to use new components**:

   ```jsx
   import { useState } from 'react';
   import NewItemList from './components/NewItemList';
   import SampleList from './components/SampleList';

   function App() {
     const [activeTab, setActiveTab] = useState('sample');

     return (
       <div>
         <h1>My App</h1>
         
         <div>
           <button onClick={() => setActiveTab('sample')}>Sample Items</button>
           <button onClick={() => setActiveTab('new')}>New Items</button>
         </div>

         {activeTab === 'sample' ? <SampleList /> : <NewItemList />}
       </div>
     );
   }

   export default App;
   ```

## Best Practices

### Backend

1. **Separation of concerns**:
   - Keep database queries in controllers
   - Keep route definitions separate from business logic
   - Use middleware for cross-cutting concerns (auth, validation)

2. **Error handling**:
   - Always wrap database operations in try/catch
   - Return appropriate status codes and error messages

3. **Database operations**:
   - Use parameterized queries to prevent SQL injection
   - Create reusable query functions for common operations

### Frontend

1. **Component structure**:
   - Create small, focused components
   - Keep state as close as possible to where it's used
   - Use custom hooks for reusable logic

2. **Data fetching**:
   - Create a dedicated API client or hooks for data fetching
   - Handle loading and error states consistently
   - Consider using React Query or SWR for complex data fetching

3. **State management**:
   - Use local state for UI-only concerns
   - Consider React Context for shared state
   - Add Redux only if state management becomes complex

## Adding Authentication

To add authentication:

1. **Backend**:
   - Add JWT or session-based auth middleware
   - Create user model and authentication routes
   - Protect routes that require authentication

2. **Frontend**:
   - Add login/signup forms
   - Store authentication tokens securely
   - Add authenticated API requests

## Testing

To add testing:

1. **Backend**:
   - Use Jest or Mocha for unit testing controllers and routes
   - Use Supertest for integration testing

2. **Frontend**:
   - Use React Testing Library for component testing
   - Use Mock Service Worker for mocking API calls

## Deployment

This template can be deployed to various platforms:

1. **Backend**:
   - Heroku, Render, Railway, or any Node.js hosting
   - Consider database migrations for production

2. **Frontend**:
   - Netlify, Vercel, or GitHub Pages
   - Configure environment variables for API URLs 
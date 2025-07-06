# Express-React Minimal Full Stack App

A minimal full-stack app with Express/SQLite backend and React frontend.

## Setup

### Backend Setup

```bash
cd server
npm install
npm run dev
```

The server will run on http://localhost:5000.

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The React app will run on http://localhost:5173.

## API Endpoints

- GET /api/sample - Returns sample items from the database

## Features

- Backend: Node.js with Express, SQLite database
- Frontend: React (Vite)
- Sample data automatically seeded on first run
- CORS enabled for API access

## Structure

- `/server` - Express backend
- `/client` - React frontend

## Development

Both the client and server use hot reloading for development. 
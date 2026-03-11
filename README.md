# Hostel Management System (HMS)

This project is a modern, production-ready MERN stack web application for hostel management.

## Project Structure

- `frontend/`: React application using modern functional components, hooks, Vite, and React Router.
- `backend/`: Node.js and Express RESTful API, connecting to a MongoDB database using Mongoose.
- `docs/`: PRDs and documentation.

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## How to Run

### Backend

1. Navigate to the backend folder:
   ```bash
   cd d:/HMS/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have MongoDB running locally, or update the `MONGO_URI` in `backend/config/db.js` with your string.
4. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd d:/HMS/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on the port printed in the terminal (usually `http://localhost:5173`).
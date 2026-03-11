import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Complaints from './pages/Complaints';
import Payments from './pages/Payments';

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Admin Dashboard Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/payments" element={<Payments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">HMS Admin</Link>
            <div className="nav-links">
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
                <Link to="/students" className={location.pathname === '/students' ? 'active' : ''}>Students</Link>
                <Link to="/rooms" className={location.pathname === '/rooms' ? 'active' : ''}>Rooms</Link>
                <Link to="/complaints" className={location.pathname === '/complaints' ? 'active' : ''}>Complaints</Link>
                <Link to="/payments" className={location.pathname === '/payments' ? 'active' : ''}>Payments</Link>
            </div>
        </nav>
    );
};

export default Navbar;

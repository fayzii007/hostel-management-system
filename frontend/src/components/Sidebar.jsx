import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, BedDouble, AlertCircle, CreditCard, LogOut, ArrowRightLeft } from 'lucide-react';

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>HMS<span>Pro</span></h2>
            </div>
            
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <Home size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/students" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <Users size={20} />
                    <span>Students</span>
                </NavLink>
                <NavLink to="/rooms" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <BedDouble size={20} />
                    <span>Rooms</span>
                </NavLink>
                <NavLink to="/complaints" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <AlertCircle size={20} />
                    <span>Complaints</span>
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <CreditCard size={20} />
                    <span>Payments</span>
                </NavLink>
                <NavLink to="/swaps" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <ArrowRightLeft size={20} />
                    <span>Room Swaps</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, BedDouble, AlertCircle, CreditCard, LogOut, ArrowRightLeft, X } from 'lucide-react';
import LogoutModal from './LogoutModal';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>HMS<span>Pro</span></h2>
                <button className="mobile-menu-btn" onClick={onClose} style={{ marginRight: 0 }}>
                    <X size={24} />
                </button>
            </div>
            
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <Home size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/students" onClick={onClose} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <Users size={20} />
                    <span>Students</span>
                </NavLink>
                <NavLink to="/rooms" onClick={onClose} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <BedDouble size={20} />
                    <span>Rooms</span>
                </NavLink>
                <NavLink to="/complaints" onClick={onClose} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <AlertCircle size={20} />
                    <span>Complaints</span>
                </NavLink>
                <NavLink to="/payments" onClick={onClose} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <CreditCard size={20} />
                    <span>Payments</span>
                </NavLink>
                <NavLink to="/swaps" onClick={onClose} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                    <ArrowRightLeft size={20} />
                    <span>Room Swaps</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogoutClick} className="logout-btn" style={{ minHeight: '44px' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <LogoutModal 
                isOpen={showLogoutModal} 
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </aside>
    );
};

export default Sidebar;

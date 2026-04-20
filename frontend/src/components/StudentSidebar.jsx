import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BedDouble, CreditCard, Utensils,
    MessageSquarePlus, Bell, User, LogOut, ArrowRightLeft, X, MapPin
} from 'lucide-react';
import LogoutModal from './LogoutModal';

const StudentSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('isStudentAuthenticated');
        localStorage.removeItem('studentPhoto'); // Clear photo too if needed
        navigate('/login');
    };

    const navItems = [
        { to: '/student/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/student/room', icon: <BedDouble size={20} />, label: 'My Room' },
        { to: '/student/fees', icon: <CreditCard size={20} />, label: 'Pay Fees' },
        { to: '/student/mess', icon: <Utensils size={20} />, label: 'Mess Menu' },
        { to: '/student/complaint', icon: <MessageSquarePlus size={20} />, label: 'Raise Complaint' },
        { to: '/student/notices', icon: <Bell size={20} />, label: 'Notices' },
        { to: '/student/profile', icon: <User size={20} />, label: 'My Profile' },
        { to: '/student/exchange', icon: <ArrowRightLeft size={20} />, label: 'Room Exchange' },
        { to: '/student/leave', icon: <MapPin size={20} />, label: 'Gate Pass' },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>HMS<span>Pro</span></h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>Student Portal</p>
                </div>
                <button className="mobile-menu-btn" onClick={onClose} style={{ marginRight: 0 }}>
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
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

export default StudentSidebar;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BedDouble, CreditCard, Utensils,
    MessageSquarePlus, Bell, User, LogOut, ArrowRightLeft
} from 'lucide-react';

const StudentSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
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
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>HMS<span>Pro</span></h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>Student Portal</p>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
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

export default StudentSidebar;

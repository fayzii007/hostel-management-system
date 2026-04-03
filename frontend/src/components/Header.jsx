import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Mail, Settings, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Header = ({ onMenuClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        authUser, signOut, 
        searchQuery, setSearchQuery, 
        notificationCount 
    } = useAuth();
    
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format page title from pathname
    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        if (!path || path === 'dashboard') return 'System Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const handleSearch = (e) => setSearchQuery(e.target.value);
    
    const handleLogoutClick = () => {
        setIsProfileOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        setShowLogoutModal(false);
        localStorage.removeItem('isAuthenticated');
        await signOut();
        navigate('/login');
    };

    const isAdminSession = localStorage.getItem('isAuthenticated') === 'true';

    // ⚡ PROXIED DATA: Admin is local/static right now.
    // If Admin session is active, ignore authUser (which might be a student)
    const adminName = isAdminSession ? 'System Admin' : (authUser?.user_metadata?.full_name || 'System Admin');
    const adminEmail = isAdminSession ? 'admin@hmspro.com' : (authUser?.email || 'admin@hmspro.com');

    return (
        <header className="header" style={{ 
            padding: '0 40px', 
            height: '80px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>{getPageTitle()}</h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Management & Overview</p>
                </div>
            </div>
            
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {/* 🔍 SEARCH BAR */}
                <div className="admin-dashboard-search" style={{ 
                    background: isSearchFocused ? 'white' : '#F1F5F9', 
                    borderRadius: '14px', 
                    border: '1.5px solid',
                    borderColor: isSearchFocused ? 'var(--primary)' : 'transparent',
                    padding: '0 16px',
                    width: '360px',
                    height: '46px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: isSearchFocused ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none'
                }}>
                    <Search size={19} style={{ color: isSearchFocused ? 'var(--primary)' : '#94A3B8' }} />
                    <input 
                        type="text" 
                        placeholder="Search students, rooms, or transactions..." 
                        style={{ background: 'transparent', width: '100%', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: 500 }}
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                </div>
                
                {/* 🔔 NOTIFICATIONS */}
                <div style={{ position: 'relative' }} ref={notificationRef}>
                    <button 
                        onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileOpen(false); }}
                        className="icon-btn" 
                        style={{ width: '46px', height: '46px', borderRadius: '14px', background: isNotificationOpen ? 'var(--primary-light)' : '#F1F5F9' }}
                    >
                        <Bell size={22} style={{ color: isNotificationOpen ? 'var(--primary)' : 'var(--text-main)' }} />
                        {notificationCount > 0 && (
                            <span style={{ 
                                position: 'absolute', top: 12, right: 12,
                                background: '#EF4444', border: '2px solid white',
                                width: '10px', height: '10px', borderRadius: '50%'
                            }}></span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                            width: '320px', background: 'white', borderRadius: '20px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                            border: '1px solid var(--border)', padding: '20px', animation: 'slideIn 0.2s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h4 style={{ margin: 0, fontWeight: 700 }}>Notifications</h4>
                                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Mark all read</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { text: 'New swap request from Khalid', time: '2m ago' },
                                    { text: 'Payment confirmation: Room 204', time: '1h ago' },
                                    { text: 'New student registration: ST-2024-001', time: '3h ago' }
                                ].map((n, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6 }} />
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>{n.text}</p>
                                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{n.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* 👤 PROFILE DROPDOWN */}
                <div style={{ position: 'relative' }} ref={profileRef}>
                    <div 
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationOpen(false); }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 4px 12px', background: '#F1F5F9', borderRadius: '16px' }}
                    >
                        <div className="profile-text-desktop" style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{adminName}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Super Admin</span>
                        </div>
                        <div style={{ 
                            width: '40px', height: '40px', 
                            background: 'var(--primary)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem'
                        }}>
                            {adminName.charAt(0)}
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                            width: '280px', background: 'white', borderRadius: '20px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                            border: '1px solid var(--border)', overflow: 'hidden', animation: 'slideIn 0.2s ease'
                        }}>
                            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 48, height: 48, background: 'var(--primary)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                                        {adminName.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{adminName}</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>{adminEmail}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '8px' }}>
                                <button style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 500, color: '#1E293B' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <ShieldCheck size={18} style={{ color: '#6366F1' }} /> Role Permissions
                                </button>
                                <button style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 500, color: '#1E293B' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <Settings size={18} style={{ color: '#6366F1' }} /> Settings
                                </button>
                                <div style={{ height: '1px', background: '#F1F5F9', margin: '8px 0' }} />
                                <button onClick={handleLogoutClick} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#EF4444' }} onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <LogOut size={18} /> Logout Session
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <LogoutModal 
                isOpen={showLogoutModal} 
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </header>
    );
};

export default Header;

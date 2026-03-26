import React, { useState } from 'react';
import { BedDouble, CreditCard, MessageSquarePlus, Bell, User, Loader2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Splash from '../../components/Splash';
import RoommateMatcher from '../../components/RoommateMatcher';
import Skeleton from '../../components/Skeleton';


const StatCard = ({ icon, label, value, color, bg, loading }) => (
    <div className="stat-card">
        <div className="stat-content">
            <h3 style={{ fontSize: '0.8rem', color: '#64748B' }}>{label}</h3>
            {loading ? (
                <Skeleton width="80px" height="24px" borderRadius="6px" />
            ) : (
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</h2>
            )}
        </div>
        <div className="stat-icon" style={{ backgroundColor: bg, color }}>
            {icon}
        </div>
    </div>
);

const StudentDashboard = () => {
    const { student, authUser, loading } = useAuth();
    const [showSplash, setShowSplash] = useState(() => {
        // Only show if it's the first time in this session
        return !sessionStorage.getItem('splashShown');
    });
    
    // Handle splash completion
    const handleSplashComplete = () => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
    };

    // ⚡ IMPROVEMENT: If we have an authUser, we show the dashboard!
    // We only show the full loader if we literally have NO user at all yet.
    if (loading && !authUser) return (
        <div className="page" style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="spin" size={32} color="var(--primary)" />
        </div>
    );

    const displayName = student?.full_name || authUser?.user_metadata?.full_name || 'HMS Student';
    const displayId   = student?.student_id || authUser?.user_metadata?.student_id || 'ID Pending...';
    const displayRoom = student?.room_number || 'Not Assigned';
    const displayFee  = student?.fee_status || 'Pending';
    const firstName   = displayName.split(' ')[0];

    // Show Splash Screen first
    if (showSplash) {
        return <Splash name={firstName} onComplete={handleSplashComplete} />;
    }

    return (
        <div className="page animate-in">
            <div className="page-header">
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 4 }}>
                        {loading ? <Skeleton width="180px" height="32px" /> : `Hello, ${firstName}! 👋`}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>Welcome to your premium student hostel portal.</p>
                </div>


                <div className="badge info" style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {loading ? <Skeleton width="80px" height="18px" /> : `ID: ${displayId}`}
                </div>
            </div>

            <div className="dashboard-grid" style={{ gap: 20 }}>
                <StatCard
                    icon={<BedDouble size={22} />}
                    label="My Room"
                    value={displayRoom === 'Not Assigned' ? 'Room TBA' : `Room ${displayRoom}`}
                    color="#4F46E5"
                    bg="#EEF2FF"
                    loading={loading}
                />
                <StatCard
                    icon={<CreditCard size={22} />}
                    label="Fee Status"
                    value={displayFee}
                    color={displayFee === 'Paid' ? '#059669' : '#D97706'}
                    bg={displayFee === 'Paid' ? '#ECFDF5' : '#FFFBEB'}
                    loading={loading}
                />
                <StatCard
                    icon={<MessageSquarePlus size={22} />}
                    label="Active Complaints"
                    value="0"
                    color="#DC2626"
                    bg="#FEF2F2"
                    loading={loading}
                />
                <StatCard
                    icon={<Bell size={22} />}
                    label="Hostel Notices"
                    value="3"
                    color="#D97706"
                    bg="#FFFBEB"
                    loading={loading}
                />
            </div>

            {/* Smart Roommate Matcher Section */}
            {!student?.room_assigned && student?.id && (
                <RoommateMatcher 
                    studentId={student.id} 
                    onMatchAccepted={(roomNum) => {
                        window.location.reload(); // Quick way to update
                    }} 
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {/* Notices Card */}
                <div style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-xl)',
                    padding: 24,
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-spring)',
                    cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #5B5FED, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={16} color="#fff" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Recent Announcements</h3>
                    </div>
                    {[
                        { title: 'New Laundry Policy', date: 'Mar 18', dot: '#5B5FED' },
                        { title: 'Late Entry Permission', date: 'Mar 17', dot: '#10b981' },
                        { title: 'Weekly Mess Change', date: 'Mar 15', dot: '#D97706' },
                    ].map((n, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.dot, flexShrink: 0 }} />
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-soft)' }}>{n.title}</p>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--background)', padding: '3px 8px', borderRadius: 99, fontWeight: 600 }}>{n.date}</span>
                        </div>
                    ))}
                </div>

                {/* Profile Card Summary */}
                <div style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-xl)',
                    padding: 24,
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-spring)',
                    cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} color="#fff" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Quick Profile</h3>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Skeleton width="52px" height="52px" borderRadius="50%" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Skeleton width="120px" height="16px" />
                                <Skeleton width="80px" height="12px" />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #5B5FED, #7C3AED)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0, boxShadow: '0 4px 14px rgba(91,95,237,0.3)' }}>
                                {displayName[0]}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-main)' }}>{displayName}</p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{student?.course || authUser?.email || 'Student Account'}</p>
                                <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', borderRadius: 99, padding: '3px 10px' }}>
                                    Active Student
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

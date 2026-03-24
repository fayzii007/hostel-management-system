import React, { useState } from 'react';
import { BedDouble, CreditCard, MessageSquarePlus, Bell, User, Loader2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Splash from '../../components/Splash';
import RoommateMatcher from '../../components/RoommateMatcher';


const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="stat-card">
        <div className="stat-content">
            <h3 style={{ fontSize: '0.8rem', color: '#64748B' }}>{label}</h3>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</h2>
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
                        Hello, {firstName}! 👋
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>Welcome to your premium student hostel portal.</p>
                </div>


                <div className="badge info" style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700 }}>
                    ID: {displayId}
                </div>
            </div>

            <div className="dashboard-grid" style={{ gap: 20 }}>
                <StatCard
                    icon={<BedDouble size={22} />}
                    label="My Room"
                    value={displayRoom === 'Not Assigned' ? 'Room TBA' : `Room ${displayRoom}`}
                    color="#4F46E5"
                    bg="#EEF2FF"
                />
                <StatCard
                    icon={<CreditCard size={22} />}
                    label="Fee Status"
                    value={displayFee}
                    color={displayFee === 'Paid' ? '#059669' : '#D97706'}
                    bg={displayFee === 'Paid' ? '#ECFDF5' : '#FFFBEB'}
                />
                <StatCard
                    icon={<MessageSquarePlus size={22} />}
                    label="Active Complaints"
                    value="0"
                    color="#DC2626"
                    bg="#FEF2F2"
                />
                <StatCard
                    icon={<Bell size={22} />}
                    label="Hostel Notices"
                    value="3"
                    color="#D97706"
                    bg="#FFFBEB"
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
                <div style={{ background: '#fff', borderRadius: '16px', padding: 24, border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Bell size={18} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Recent Announcements</h3>
                    </div>
                    {[
                        { title: 'New Laundry Policy', date: 'Mar 18' },
                        { title: 'Late Entry Permission', date: 'Mar 17' },
                        { title: 'Weekly Mess Change', date: 'Mar 15' },
                    ].map((n, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{n.title}</p>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{n.date}</span>
                        </div>
                    ))}
                </div>

                {/* Profile Card Summary */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: 24, border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <User size={18} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Quick Profile</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {displayName[0]}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{displayName}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>{student?.course || authUser?.email || 'Student Account'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

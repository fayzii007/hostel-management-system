import React, { useState } from 'react';
import { BedDouble, CreditCard, MessageSquarePlus, Bell, User, Loader2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Splash from '../../components/Splash';
import RoommateMatcher from '../../components/RoommateMatcher';
import Skeleton from '../../components/Skeleton';


const StatCard = ({ icon, label, value, color, bg, loading, badge }) => (
    <div className="stat-card">
        <div className="stat-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</h3>
                {badge && <span className={`status-badge ${badge.type}`}>{badge.text}</span>}
            </div>
            {loading ? (
                <Skeleton width="80px" height="24px" borderRadius="6px" />
            ) : (
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{value}</h2>
            )}
        </div>
        <div className="stat-icon" style={{ backgroundColor: bg, color }}>
            {icon}
        </div>
    </div>
);

const StudentDashboard = () => {
    const { student, authUser, loading } = useAuth();
    const [toast, setToast] = useState(null);
    const [hideMatcher, setHideMatcher] = useState(false);
    const [assignedRoom, setAssignedRoom] = useState(null);
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
    const displayRoom = assignedRoom || student?.room_number || 'Not Assigned';
    const displayFee  = student?.fee_status || 'Pending';
    const firstName   = displayName.split(' ')[0];

    // Show Splash Screen first
    if (showSplash) {
        return <Splash name={firstName} onComplete={handleSplashComplete} />;
    }

    return (
        <div className="page animate-in">
            {toast && (
                <div style={{
                    position: 'fixed', top: 30, right: 30, zIndex: 1000,
                    background: '#10b981', color: 'white', padding: '12px 24px',
                    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                    fontWeight: 600, animation: 'slideIn 0.35s ease-out'
                }}>
                    ✨ {toast}
                </div>
            )}
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

            <div className="quick-actions">
                <button className="btn" style={{ background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
                    <MessageSquarePlus size={18} color="var(--primary)" /> Raise Complaint
                </button>
                <button className="btn" style={{ background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
                    <CreditCard size={18} color="#059669" /> Pay Fee
                </button>
                <button className="btn" style={{ background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
                    <User size={18} color="#D97706" /> Update Profile
                </button>
            </div>

            <div className="dashboard-grid" style={{ gap: 20 }}>
                <StatCard
                    icon={<BedDouble size={22} />}
                    label="My Room"
                    value={displayRoom === 'Not Assigned' ? 'Room TBA' : `Room ${displayRoom}`}
                    color="#4F46E5"
                    bg="#EEF2FF"
                    loading={loading}
                    badge={displayRoom === 'Not Assigned' ? { type: 'due-soon', text: 'Action Needed' } : null}
                />
                <StatCard
                    icon={<CreditCard size={22} />}
                    label="Fee Status"
                    value={displayFee}
                    color={displayFee === 'Paid' ? '#059669' : '#D97706'}
                    bg={displayFee === 'Paid' ? '#ECFDF5' : '#FFFBEB'}
                    loading={loading}
                    badge={displayFee === 'Paid' ? { type: 'paid', text: 'Clear' } : { type: 'due-soon', text: 'Due Soon' }}
                />
                <StatCard
                    icon={<MessageSquarePlus size={22} />}
                    label="Complaints"
                    value="0"
                    color="#DC2626"
                    bg="#FEF2F2"
                    loading={loading}
                    badge={{ type: 'no-open', text: 'No Open' }}
                />
                <StatCard
                    icon={<Bell size={22} />}
                    label="Notices"
                    value="3"
                    color="#D97706"
                    bg="#FFFBEB"
                    loading={loading}
                    badge={{ type: 'info', text: 'New' }}
                />
            </div>

            {/* Smart Roommate Matcher Section */}
            {!student?.room_assigned && student?.id && !hideMatcher && (
                <div className="highlighted-section">
                    <p style={{ margin: '0 0 16px 0', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>✨ Smart Suggestion</p>
                    <RoommateMatcher 
                        studentId={student.id} 
                        onMatchAccepted={(roomNum) => {
                            setHideMatcher(true);
                            setAssignedRoom(roomNum);
                            setToast(`Roommate match accepted successfully! Room ${roomNum} assigned.`);
                            setTimeout(() => setToast(null), 3500);
                        }} 
                    />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {/* Recent Activity Card */}
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
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Recent Activity</h3>
                    </div>
                    
                    <div className="recent-activity">
                        {[
                            { title: 'Room 204 Assigned', time: '2 hours ago', icon: <BedDouble size={18} />, color: '#4F46E5', bg: '#EEF2FF' },
                            { title: 'Fee Payment Successful', time: '1 day ago', icon: <CreditCard size={18} />, color: '#059669', bg: '#ECFDF5' },
                            { title: 'Notice: Laundry Timings Changed', time: '3 days ago', icon: <Info size={18} />, color: '#D97706', bg: '#FFFBEB' },
                        ].map((activity, i) => (
                            <div key={i} className="activity-item">
                                <div className="activity-icon" style={{ backgroundColor: activity.bg, color: activity.color }}>
                                    {activity.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{activity.title}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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

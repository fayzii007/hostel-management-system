import React from 'react';
import { BedDouble, CreditCard, MessageSquarePlus, Bell } from 'lucide-react';

const STUDENT = {
    name: 'Mohammed Fayaz VP',
    studentId: 'ST-2024-001',
    room: '100',
    feeStatus: 'Paid',
    activeComplaints: 1,
    notices: 3,
};

const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="stat-card">
        <div className="stat-content">
            <h3>{label}</h3>
            <h2 style={{ fontSize: '1.75rem' }}>{value}</h2>
        </div>
        <div className="stat-icon" style={{ backgroundColor: bg, color }}>
            {icon}
        </div>
    </div>
);

const StudentDashboard = () => {
    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>Welcome back, {STUDENT.name.split(' ')[0]} 👋</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>
                        Here's a quick overview of your hostel status
                    </p>
                </div>
                <span className="badge info" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                    Student ID: {STUDENT.studentId}
                </span>
            </div>

            <div className="dashboard-grid">
                <StatCard
                    icon={<BedDouble size={26} />}
                    label="My Room"
                    value={`Room ${STUDENT.room}`}
                    color="#4F46E5"
                    bg="#EEF2FF"
                />
                <StatCard
                    icon={<CreditCard size={26} />}
                    label="Fee Status"
                    value={STUDENT.feeStatus}
                    color={STUDENT.feeStatus === 'Paid' ? '#065F46' : '#92400E'}
                    bg={STUDENT.feeStatus === 'Paid' ? '#D1FAE5' : '#FEF3C7'}
                />
                <StatCard
                    icon={<MessageSquarePlus size={26} />}
                    label="Active Complaints"
                    value={STUDENT.activeComplaints}
                    color="#DC2626"
                    bg="#FEE2E2"
                />
                <StatCard
                    icon={<Bell size={26} />}
                    label="New Notices"
                    value={STUDENT.notices}
                    color="#D97706"
                    bg="#FEF3C7"
                />
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Recent Notices */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>📢 Latest Notices</h3>
                    {[
                        { title: 'Hostel Day Celebration', date: 'Mar 20', tag: 'Event' },
                        { title: 'Water Supply Maintenance', date: 'Mar 18', tag: 'Maintenance' },
                        { title: 'Fee Last Date Reminder', date: 'Mar 17', tag: 'Fee' },
                    ].map((n, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{n.title}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</p>
                            </div>
                            <span className="badge info" style={{ fontSize: '0.7rem' }}>{n.tag}</span>
                        </div>
                    ))}
                </div>

                {/* My Complaints */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>📝 My Complaints</h3>
                    {[
                        { desc: 'Water leakage in bathroom', status: 'Pending', date: 'Mar 15' },
                        { desc: 'Fan not working in room', status: 'Resolved', date: 'Mar 10' },
                    ].map((c, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 1 ? '1px solid var(--border)' : 'none' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{c.desc}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.date}</p>
                            </div>
                            <span className={`badge ${c.status === 'Resolved' ? 'success' : 'warning'}`} style={{ fontSize: '0.7rem' }}>{c.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

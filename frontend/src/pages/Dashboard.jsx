import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Users, BedDouble, AlertCircle, CreditCard, TrendingUp,
    Plus, Send, ArrowRightLeft, CheckCircle2, Clock,
    UserPlus, Zap, ChevronRight, ShieldAlert
} from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

// ─── Custom Recharts Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#0F172A', color: '#fff',
                padding: '10px 16px', borderRadius: 12,
                fontSize: '0.8rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
                <p style={{ margin: '0 0 4px', color: '#94A3B8', fontWeight: 600 }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ margin: 0, fontWeight: 700, color: p.color || '#fff' }}>
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Activity Item ─────────────────────────────────────────────────────
const ActivityItem = ({ icon, iconBg, text, time, isLast }) => (
    <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        paddingBottom: isLast ? 0 : 18,
        borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
        marginBottom: isLast ? 0 : 18,
    }}>
        <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: iconBg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
        }}>
            {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-soft)', lineHeight: 1.4 }}>{text}</p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Clock size={10} /> {time}
            </span>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────
const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ students: 0, rooms: 0, complaints: 0, payments: 0 });
    const [loading, setLoading] = useState(true);
    const [complaintChartData, setComplaintChartData] = useState([]);
    const [paymentChartData, setPaymentChartData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [studentsRes, roomsRes, complaintsRes, paymentsRes] = await Promise.all([
                    api.get('/students').catch(() => ({ data: [] })),
                    api.get('/rooms').catch(() => ({ data: [] })),
                    api.get('/complaints').catch(() => ({ data: [] })),
                    api.get('/payments').catch(() => ({ data: [] }))
                ]);

                const students = studentsRes.data || [];
                const rooms = roomsRes.data || [];
                const complaints = complaintsRes.data || [];
                const payments = paymentsRes.data || [];

                setStats({
                    students: students.length,
                    rooms: rooms.length,
                    complaints: complaints.length,
                    payments: payments.length
                });

                // ── Complaint Status Pie Chart ──
                const statusCounts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
                complaints.forEach(c => {
                    const s = (c.status || '').toLowerCase();
                    if (s === 'pending') statusCounts['Pending']++;
                    else if (s === 'in_progress' || s === 'in progress') statusCounts['In Progress']++;
                    else if (s === 'resolved') statusCounts['Resolved']++;
                    else statusCounts['Pending']++; // default unmapped statuses to pending
                });
                const total = complaints.length || 1;
                const cData = [
                    { name: 'Pending', value: statusCounts['Pending'], color: '#EF4444', bg: '#FEE2E2', pct: Math.round((statusCounts['Pending'] / total) * 100) },
                    { name: 'In Progress', value: statusCounts['In Progress'], color: '#F59E0B', bg: '#FEF9C3', pct: Math.round((statusCounts['In Progress'] / total) * 100) },
                    { name: 'Resolved', value: statusCounts['Resolved'], color: '#22C55E', bg: '#DCFCE7', pct: Math.round((statusCounts['Resolved'] / total) * 100) },
                ];
                // Only show slices that have data; fill with demo if zero complaints
                setComplaintChartData(complaints.length > 0 ? cData : [
                    { name: 'Pending', value: 5, color: '#EF4444', bg: '#FEE2E2', pct: 42 },
                    { name: 'In Progress', value: 3, color: '#F59E0B', bg: '#FEF9C3', pct: 25 },
                    { name: 'Resolved', value: 4, color: '#22C55E', bg: '#DCFCE7', pct: 33 },
                ]);

                // ── Payment over months area chart ──
                const monthMap = {};
                payments.forEach(p => {
                    const d = new Date(p.created_at || p.date);
                    if (isNaN(d)) return;
                    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
                    monthMap[key] = (monthMap[key] || 0) + (p.amount || 0);
                });
                const payData = Object.entries(monthMap)
                    .map(([month, amount]) => ({ month, amount }))
                    .slice(-6);
                setPaymentChartData(payData.length > 0 ? payData : [
                    { month: 'Oct 24', amount: 12000 },
                    { month: 'Nov 24', amount: 18500 },
                    { month: 'Dec 24', amount: 9500 },
                    { month: 'Jan 25', amount: 22000 },
                    { month: 'Feb 25', amount: 15000 },
                    { month: 'Mar 25', amount: 27000 },
                ]);

                // ── Recent Activity ──
                const activity = [];
                students.slice(0, 2).forEach(s => {
                    activity.push({
                        type: 'student',
                        text: `${s.full_name || 'A new student'} was added`,
                        time: s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recently',
                        iconBg: '#EEF0FF', icon: <UserPlus size={15} color="#5B5FED" />
                    });
                });
                complaints.slice(0, 2).forEach(c => {
                    activity.push({
                        type: 'complaint',
                        text: `Complaint: "${(c.description || 'Issue reported').substring(0, 45)}..."`,
                        time: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recently',
                        iconBg: '#FEF9C3', icon: <AlertCircle size={15} color="#D97706" />
                    });
                });
                payments.slice(0, 2).forEach(p => {
                    activity.push({
                        type: 'payment',
                        text: `Payment of ₹${(p.amount || 0).toLocaleString()} received`,
                        time: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recently',
                        iconBg: '#DCFCE7', icon: <CheckCircle2 size={15} color="#15803D" />
                    });
                });
                setRecentActivity(activity.slice(0, 6));
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const statCards = [
        { label: 'Total Students', value: stats.students, icon: <Users size={22} />, iconBg: 'linear-gradient(135deg, #5B5FED, #7C3AED)', accent: '#5B5FED', trend: 'Enrolled this semester' },
        { label: 'Total Rooms', value: stats.rooms, icon: <BedDouble size={22} />, iconBg: 'linear-gradient(135deg, #059669, #10b981)', accent: '#10b981', trend: 'Across all floors' },
        { label: 'Complaints', value: stats.complaints, icon: <AlertCircle size={22} />, iconBg: 'linear-gradient(135deg, #D97706, #F59E0B)', accent: '#D97706', trend: 'Pending resolution' },
        { label: 'Payments', value: stats.payments, icon: <CreditCard size={22} />, iconBg: 'linear-gradient(135deg, #9333EA, #C084FC)', accent: '#9333EA', trend: 'Transactions logged' },
    ];

    const quickActions = [
        { label: 'Add Student', icon: <Plus size={16} />, color: '#5B5FED', bg: '#EEF0FF', to: '/students' },
        { label: 'Add Room', icon: <BedDouble size={16} />, color: '#059669', bg: '#DCFCE7', to: '/rooms' },
        { label: 'View Swaps', icon: <ArrowRightLeft size={16} />, color: '#9333EA', bg: '#F3E8FF', to: '/swaps' },
        { label: 'Send Notice', icon: <Send size={16} />, color: '#D97706', bg: '#FEF9C3', to: null },
    ];

    const fallbackActivity = [
        { text: 'Mohammed Fayaz was added as a student', time: '2 mins ago', iconBg: '#EEF0FF', icon: <UserPlus size={15} color="#5B5FED" /> },
        { text: 'Room 204 was assigned to Khalid Ahmed', time: '1 hour ago', iconBg: '#DCFCE7', icon: <BedDouble size={15} color="#15803D" /> },
        { text: 'Payment of ₹12,000 received for Room 101', time: '3 hours ago', iconBg: '#DCFCE7', icon: <CheckCircle2 size={15} color="#15803D" /> },
        { text: 'Complaint: [Wi-Fi] not working resolved', time: '5 hours ago', iconBg: '#FEF9C3', icon: <AlertCircle size={15} color="#D97706" /> },
        { text: 'Room swap request: 101 ↔ 204 completed', time: 'Yesterday', iconBg: '#F3E8FF', icon: <ArrowRightLeft size={15} color="#9333EA" /> },
    ];

    const activityToShow = recentActivity.length > 0 ? recentActivity : fallbackActivity;

    return (
        <div className="page">
            {/* ── Page Header + Quick Actions ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                <div>
                    <h2 style={{ marginBottom: 4 }}>Dashboard Overview</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Welcome back, System Admin 👋 — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {quickActions.map((a, i) => (
                        <button
                            key={i}
                            onClick={() => a.to ? navigate(a.to) : alert('Notice feature coming soon!')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '9px 16px', borderRadius: 999, border: 'none',
                                background: a.bg, color: a.color, fontWeight: 700,
                                fontSize: '0.82rem', cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px ${a.color}30`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; }}
                        >
                            {a.icon} {a.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="dashboard-grid">
                {statCards.map((card, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-content">
                            <h3>{card.label}</h3>
                            {loading
                                ? <Skeleton width="60px" height="36px" borderRadius="8px" />
                                : <h2>{card.value}</h2>
                            }
                            <p style={{ margin: '8px 0 0', fontSize: '0.72rem', color: card.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <TrendingUp size={11} /> {card.trend}
                            </p>
                        </div>
                        <div className="stat-icon" style={{ background: card.iconBg, color: '#fff', boxShadow: `0 8px 20px ${card.accent}40` }}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts + Activity Feed Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* ── Complaint Status Pie Chart ── */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #EF4444, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldAlert size={15} color="#fff" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Complaint Status</h3>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    Total: {complaintChartData.reduce((s, d) => s + d.value, 0)} complaints
                                </p>
                            </div>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#EF4444', background: '#FEE2E2', padding: '4px 10px', borderRadius: 99 }}>Live</span>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 16 }}>
                            <Skeleton width="160px" height="160px" borderRadius="50%" />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <Skeleton width="80px" height="32px" borderRadius="8px" />
                                <Skeleton width="80px" height="32px" borderRadius="8px" />
                                <Skeleton width="80px" height="32px" borderRadius="8px" />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                            {/* Pie */}
                            <div style={{ flex: '0 0 auto' }}>
                                <ResponsiveContainer width={190} height={190}>
                                    <PieChart>
                                        <Pie
                                            data={complaintChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={52}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                            strokeWidth={0}
                                            animationBegin={0}
                                            animationDuration={800}
                                        >
                                            {complaintChartData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div style={{ background: '#0F172A', color: '#fff', padding: '10px 14px', borderRadius: 12, fontSize: '0.8rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                                                            <p style={{ margin: '0 0 4px', color: d.color, fontWeight: 700 }}>{d.name}</p>
                                                            <p style={{ margin: 0 }}>{d.value} complaints <span style={{ color: '#94A3B8' }}>({d.pct}%)</span></p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend badges */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 120 }}>
                                {complaintChartData.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: item.bg }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{item.name}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 800, color: item.color }}>{item.value}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#6B7280', marginLeft: 4 }}>({item.pct}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Area Chart: Payments over time */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Payment Trends</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Revenue over last 6 months</p>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#DCFCE7', padding: '4px 10px', borderRadius: 99 }}>₹ INR</span>
                    </div>
                    {loading ? (
                        <Skeleton width="100%" height="200px" borderRadius="12px" />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={paymentChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5B5FED" stopOpacity={0.18} />
                                        <stop offset="100%" stopColor="#5B5FED" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#5B5FED', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="amount" name="Amount (₹)" stroke="#5B5FED" strokeWidth={2.5} fill="url(#areaGradient)" dot={{ fill: '#5B5FED', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#5B5FED' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── Recent Activity Feed ── */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #5B5FED, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={15} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Recent Activity</h3>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Latest system events</p>
                        </div>
                    </div>
                    <button
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 99, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        View All <ChevronRight size={13} />
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Skeleton width="36px" height="36px" borderRadius="50%" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="60%" height="14px" />
                                    <div style={{ marginTop: 6 }}><Skeleton width="30%" height="10px" /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0 32px' }}>
                        {activityToShow.map((item, i) => (
                            <ActivityItem
                                key={i}
                                icon={item.icon}
                                iconBg={item.iconBg}
                                text={item.text}
                                time={item.time}
                                isLast={i === activityToShow.length - 1 || i === activityToShow.length - 2}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

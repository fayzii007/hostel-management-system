import React from 'react';
import { Bell } from 'lucide-react';

const notices = [
    {
        id: 1, title: 'Hostel Day Celebration 🎉', date: 'March 20, 2025', tag: 'Event', // Past date, will show Expired
        description: 'Annual Hostel Day celebration will be held on March 20th in the main courtyard. All students are encouraged to participate.',
        tagClass: 'info',
    },
    {
        id: 2, title: 'Tech Symposium 2026', date: 'May 10, 2026', tag: 'Event', // Future date from current 2026
        description: 'The annual tech symposium will feature guest speakers and project showcases. Registration opens next week.',
        tagClass: 'info',
    },
    {
        id: 3, title: 'Water Supply Maintenance', date: 'April 18, 2026', tag: 'Maintenance',
        description: 'Due to scheduled maintenance, water supply will be interrupted from 9 AM to 1 PM on April 18.',
        tagClass: 'warning',
    },
];

const Notices = () => {
    return (
        <div className="page">
            <div className="page-header">
                <h2>📢 Notices</h2>
                <span className="badge warning" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>{notices.length} Notices</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {notices.map((notice, i) => {
                    const isExpired = notice.tag === 'Event' && new Date(notice.date).getTime() < new Date().getTime();
                    
                    return (
                    <div
                        key={notice.id}
                        style={{
                            background: 'var(--surface)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px 28px',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            gap: 20,
                            transition: 'all 0.2s',
                            opacity: isExpired ? 0.7 : 1, // Dim expired events slightly
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                    >
                        <div style={{
                            width: 44, height: 44, background: isExpired ? '#F1F5F9' : '#EEF2FF', borderRadius: 'var(--radius-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isExpired ? '#64748B' : '#4F46E5', flexShrink: 0,
                        }}>
                            <Bell size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: isExpired ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                    {notice.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {isExpired ? (
                                        <span className="badge" style={{ background: '#F1F5F9', color: '#64748B', fontSize: '0.7rem' }}>Expired</span>
                                    ) : (
                                        <span className={`badge ${notice.tagClass}`} style={{ fontSize: '0.7rem' }}>{notice.tag}</span>
                                    )}
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: isExpired ? 'line-through' : 'none' }}>{notice.date}</span>
                                </div>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{notice.description}</p>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default Notices;

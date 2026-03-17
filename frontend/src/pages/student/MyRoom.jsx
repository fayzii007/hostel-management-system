import React from 'react';
import { BedDouble, Users, Calendar } from 'lucide-react';

const MyRoom = () => {
    const roomData = {
        roomNumber: '100',
        block: 'Block A',
        floor: '1st Floor',
        type: 'Double Sharing',
        bedNumber: 'Bed A',
        checkIn: '2024-07-15',
        roommates: ['Khalid Naufal Khalid'],
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>🛏️ My Room Details</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Room Info Card */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                        <div style={{ width: 64, height: 64, background: '#EEF2FF', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                            <BedDouble size={32} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Room {roomData.roomNumber}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{roomData.block} · {roomData.floor}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        {[
                            { label: 'Room Type', value: roomData.type },
                            { label: 'Bed Number', value: roomData.bedNumber },
                            { label: 'Block', value: roomData.block },
                            { label: 'Floor', value: roomData.floor },
                            { label: 'Check-in Date', value: new Date(roomData.checkIn).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                            { label: 'Status', value: 'Active' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: 16, background: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{item.label}</p>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
                                    {item.label === 'Status' ? <span className="badge success">{item.value}</span> : item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roommates */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Users size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Roommates</h3>
                    </div>
                    {roomData.roommates.map((name, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 700, fontSize: '0.9rem' }}>
                                {name[0]}
                            </div>
                            <p style={{ margin: 0, fontWeight: 500 }}>{name}</p>
                        </div>
                    ))}
                </div>

                {/* Check-in Info */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Calendar size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Stay Info</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check-in Date</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>July 15, 2024</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Duration</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>~8 months</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Checkout Plan</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>May 2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRoom;

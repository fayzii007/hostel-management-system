import React, { useEffect, useState } from 'react';
import { BedDouble, Users, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const MyRoom = () => {
    const { student } = useAuth();
    const [roommates, setRoommates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student?.room_number) {
            fetchRoommates();
        }
    }, [student]);

    const fetchRoommates = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/students/roommates/${student.room_number}?exclude=${student.student_id}`);
            setRoommates(data.map(s => s.full_name));
        } catch (err) {
            console.error('Roommate fetch error:', err);
        } finally {
            setLoading(false);
        }
    };


    if (!student?.room_number) {
        return (
            <div className="page">
                <div className="page-header"><h2>🛏️ My Room Details</h2></div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 64, border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#9CA3AF' }}>
                        <BedDouble size={40} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>No Room Assigned</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Please contact the hostel admin to assign a room.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>🛏️ My Room Details</h2>
                <span className="badge info" style={{ padding: '8px 16px' }}>Room {student.room_number}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                        <div style={{ width: 64, height: 64, background: '#EEF2FF', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                            <BedDouble size={32} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Room {student.room_number}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Assigned Room · Bed A</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                        {[
                            { label: 'Room Number', value: student.room_number },
                            { label: 'Occupancy Status', value: roommates.length + 1 + ' Students' },
                            { label: 'Check-in Date', value: new Date(student.created_at).toLocaleDateString() },
                            { label: 'Room Type', value: 'Double Sharing' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: 16, background: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={20} color="var(--primary)" /> Your Roommates
                    </h3>
                    {loading ? <div style={{ textAlign: 'center', padding: '20px 0' }}><Loader2 className="spin" /></div> : (
                        roommates.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No roommates yet.</p> : (
                            roommates.map((name, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < roommates.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 700, fontSize: '0.9rem' }}>
                                        {name[0]}
                                    </div>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{name}</p>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRoom;

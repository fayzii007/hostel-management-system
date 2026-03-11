import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        rooms: 0,
        complaints: 0,
        payments: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [studentsRes, roomsRes, complaintsRes, paymentsRes] = await Promise.all([
                    api.get('/students').catch(() => ({ data: [] })),
                    api.get('/rooms').catch(() => ({ data: [] })),
                    api.get('/complaints').catch(() => ({ data: [] })),
                    api.get('/payments').catch(() => ({ data: [] }))
                ]);

                setStats({
                    students: studentsRes.data.length || 0,
                    rooms: roomsRes.data.length || 0,
                    complaints: complaintsRes.data.length || 0,
                    payments: paymentsRes.data.length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="page">
            <h2>Admin Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Students</h3>
                    <h2>{stats.students}</h2>
                </div>
                <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Rooms</h3>
                    <h2>{stats.rooms}</h2>
                </div>
                <div style={{ padding: '20px', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Complaints</h3>
                    <h2>{stats.complaints}</h2>
                </div>
                <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Payments</h3>
                    <h2>{stats.payments}</h2>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

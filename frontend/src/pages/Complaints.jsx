import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, Clock, User } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            setLoading(true);
            await api.put(`/complaints/${id}`, { status: 'Resolved' });
            await fetchComplaints(); // Refresh list
        } catch (error) {
            alert('Error resolving complaint: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Complaints Management</h2>
            </div>
            
            {/* --- DESKTOP VIEW --- */}
            <div className="table-container hide-on-mobile">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Skeleton width="32px" height="32px" borderRadius="50%" />
                                            <Skeleton width="80px" height="20px" borderRadius="6px" />
                                        </div>
                                    </td>
                                    <td><Skeleton width="300px" height="18px" /></td>
                                    <td><Skeleton width="100px" height="18px" /></td>
                                    <td><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                                    <td><Skeleton width="100px" height="32px" borderRadius="8px" /></td>
                                </tr>
                            ))
                        ) : complaints.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No complaints found</td></tr>
                        ) : (
                            complaints.map(complaint => (
                                <tr key={complaint.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--primary)' }}>
                                                <User size={16} style={{ margin: 'auto' }} />
                                            </div>
                                            <span className="badge info" style={{ fontWeight: 700 }}>{complaint.student_id}</span>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '400px' }}>
                                        <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                                            {complaint.description}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Clock size={14} />
                                            {new Date(complaint.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${complaint.status === 'Resolved' ? 'success' : 'warning'}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td>
                                        {complaint.status !== 'Resolved' && (
                                            <button 
                                                className="btn" 
                                                onClick={() => handleResolve(complaint.id)}
                                                disabled={loading}
                                                style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: '#10B981', color: 'white', borderRadius: 8 }}
                                            >
                                                <CheckCircle size={14} /> Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE VIEW --- */}
            <div className={`complaints-mobile-grid ${!loading ? 'active' : ''}`}>
                {complaints.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
                        <p>No complaints found</p>
                    </div>
                ) : (
                    complaints.map(complaint => (
                        <div key={complaint.id} className="complaint-card">
                            <div className="complaint-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={14} color="var(--primary)" />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{complaint.student_id}</span>
                                </div>
                                <span className={`badge ${complaint.status === 'Resolved' ? 'success' : 'warning'}`}>
                                    {complaint.status}
                                </span>
                            </div>
                            
                            <div className="complaint-card-desc">
                                {complaint.description}
                            </div>
                            
                            <div className="complaint-card-footer">
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={12} /> {new Date(complaint.created_at).toLocaleDateString()}
                                </span>
                                {complaint.status !== 'Resolved' && (
                                    <button 
                                        className="btn" 
                                        onClick={() => handleResolve(complaint.id)}
                                        disabled={loading}
                                        style={{ padding: '6px 12px', fontSize: '0.75rem', backgroundColor: '#10B981', color: 'white' }}
                                    >
                                        <CheckCircle size={14} /> Resolve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Mobile Skeletons */}
            {loading && (
                <div className="complaints-mobile-grid active show-on-mobile" style={{ display: 'none' }}>
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="complaint-card">
                            <div className="complaint-card-header">
                                <Skeleton width="100px" height="20px" />
                                <Skeleton width="60px" height="20px" borderRadius="10px" />
                            </div>
                            <Skeleton width="100%" height="60px" />
                            <div className="complaint-card-footer" style={{ marginTop: 16 }}>
                                <Skeleton width="80px" height="14px" />
                                <Skeleton width="80px" height="30px" borderRadius="8px" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Complaints;

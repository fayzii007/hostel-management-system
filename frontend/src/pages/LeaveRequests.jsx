import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Clock, MapPin, User, Calendar } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import '../index.css';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/leaves');
            setLeaves(data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            setLoading(true);
            await api.put(`/leaves/${id}`, { status });
            await fetchLeaves(); // Refresh
        } catch (error) {
            alert(`Error ${status.toLowerCase()} request: ` + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page animate-in">
            <div className="page-header">
                <h2>Leave Approvals</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage student leave applications and generate gate passes.</p>
            </div>
            
            <div className="table-container hide-on-mobile">
                <table>
                    <thead>
                        <tr>
                            <th>Student Details</th>
                            <th>Leave Duration</th>
                            <th>Reason & Destination</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td><div style={{ display: 'flex', gap: 10 }}><Skeleton width="32px" height="32px" borderRadius="50%" /><Skeleton width="100px" height="20px" /></div></td>
                                    <td><Skeleton width="120px" height="20px" /></td>
                                    <td><Skeleton width="200px" height="20px" /></td>
                                    <td><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                                    <td><Skeleton width="140px" height="32px" borderRadius="8px" /></td>
                                </tr>
                            ))
                        ) : leaves.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No leave requests found</td></tr>
                        ) : (
                            leaves.map(req => (
                                <tr key={req.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{req.students?.full_name || 'Unknown'}</p>
                                                <span className="badge info" style={{ fontSize: '0.7rem', marginTop: 4 }}>Room: {req.students?.room_number || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>
                                            <Calendar size={14} color="var(--primary)" />
                                            {new Date(req.from_date).toLocaleDateString('en-GB')} <br/>to<br/> {new Date(req.to_date).toLocaleDateString('en-GB')}
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: 300 }}>
                                        <p style={{ margin: '0 0 6px', fontWeight: 500, color: 'var(--text-main)' }}>{req.reason}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <MapPin size={12} /> {req.destination || 'Not specified'}
                                        </p>
                                    </td>
                                    <td>
                                        <span className={`badge ${req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                            {req.status === 'Pending' && <Clock size={12} style={{marginRight:4, display:'inline-block'}} />}
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        {req.status === 'Pending' ? (
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button 
                                                    className="btn" 
                                                    onClick={() => handleUpdateStatus(req.id, 'Approved')}
                                                    style={{ padding: '8px 12px', fontSize: '0.8rem', backgroundColor: '#10B981', color: 'white', borderRadius: 8 }}
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button 
                                                    className="btn" 
                                                    onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                                    style={{ padding: '8px 12px', fontSize: '0.8rem', backgroundColor: '#EF4444', color: 'white', borderRadius: 8 }}
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className={`complaints-mobile-grid ${!loading ? 'active' : ''}`}>
                {leaves.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
                        <p>No leave requests found</p>
                    </div>
                ) : (
                    leaves.map(req => (
                        <div key={req.id} className="complaint-card">
                            <div className="complaint-card-header" style={{ marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={14} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>{req.students?.full_name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room {req.students?.room_number}</span>
                                    </div>
                                </div>
                                <span className={`badge ${req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                    {req.status}
                                </span>
                            </div>
                            
                            <div className="complaint-card-desc" style={{ padding: '12px 0 0', borderTop: '1px dashed var(--border-light)', marginTop: 8 }}>
                                <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: '0.85rem' }}>
                                    <Calendar size={14} style={{ display:'inline', marginRight: 6, color:'var(--primary)' }} />
                                    {new Date(req.from_date).toLocaleDateString()} - {new Date(req.to_date).toLocaleDateString()}
                                </p>
                                <p style={{ margin: '0 0 6px' }}>{req.reason}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}><MapPin size={12} style={{ display:'inline' }} /> {req.destination || 'N/A'}</p>
                            </div>
                            
                            {req.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: 8, paddingTop: 16, marginTop: 16, borderTop: '1px dashed var(--border)' }}>
                                    <button onClick={() => handleUpdateStatus(req.id, 'Approved')} style={{ flex: 1, padding: '10px', background: '#DCFCE7', color: '#15803D', border: 'none', borderRadius: 8, fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                    <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} style={{ flex: 1, padding: '10px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 8, fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeaveRequests;

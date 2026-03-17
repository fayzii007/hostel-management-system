import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle } from 'lucide-react';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Complaints Management</h2>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No complaints found</td></tr>
                        ) : (
                            complaints.map(complaint => (
                                <tr key={complaint.id}>
                                    <td>
                                        <span className="badge info">{complaint.studentId}</span>
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {complaint.description}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge ${complaint.status === 'Resolved' ? 'success' : 'warning'}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td>
                                        {complaint.status !== 'Resolved' && (
                                            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#10B981' }}>
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
        </div>
    );
};

export default Complaints;

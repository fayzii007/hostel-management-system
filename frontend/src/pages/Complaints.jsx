import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Complaints Management</h2>
            </div>
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
                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>No complaints found</td></tr>
                    ) : (
                        complaints.map(complaint => (
                            <tr key={complaint._id}>
                                <td>{complaint.studentId}</td>
                                <td>{complaint.description}</td>
                                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        background: complaint.status === 'Resolved' ? '#e8f5e9' : '#fff3e0',
                                        color: complaint.status === 'Resolved' ? '#2e7d32' : '#e65100'
                                    }}>
                                        {complaint.status}
                                    </span>
                                </td>
                                <td>
                                    {complaint.status !== 'Resolved' && (
                                        <button className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Resolve</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Complaints;

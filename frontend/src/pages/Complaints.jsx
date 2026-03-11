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
                                    <span className={`badge ${complaint.status === 'Resolved' ? 'success' : 'warning'}`}>
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

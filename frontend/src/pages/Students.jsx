import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Students = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    return (
        <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Students Management</h2>
                <button className="btn">+ Add Student</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Room</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No students found</td></tr>
                    ) : (
                        students.map(student => (
                            <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>{student.studentId}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{student.roomNumber || 'Unassigned'}</td>
                                <td>
                                    <button className="btn" style={{ background: '#e74c3c', padding: '5px 10px', fontSize: '0.8rem' }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Students;

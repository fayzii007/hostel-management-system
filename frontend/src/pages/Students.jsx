import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StudentModal from '../components/StudentModal';
import { Plus, Trash2 } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAddStudent = async (studentData) => {
        try {
            await api.post('/students', studentData);
            fetchStudents();
            setIsModalOpen(false);
        } catch (error) {
            alert('Error adding student: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (error) {
                alert('Error deleting student: ' + error.message);
            }
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Students Management</h2>
                <button className="btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Student
                </button>
            </div>

            <div className="table-container">
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
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No students found</td></tr>
                        ) : (
                            students.map(student => (
                                <tr key={student.id}>
                                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                                    <td>
                                        <span className="badge info">{student.studentId}</span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{student.phone}</td>
                                    <td>
                                        {student.roomNumber ? (
                                            <span style={{ fontWeight: 500 }}>{student.roomNumber}</span>
                                        ) : (
                                            <span className="badge warning">Unassigned</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="icon-btn"
                                            style={{ color: '#EF4444', width: '32px', height: '32px' }}
                                            onClick={() => handleDelete(student.id)}
                                            title="Delete Student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddStudent}
            />
        </div>
    );
};

export default Students;

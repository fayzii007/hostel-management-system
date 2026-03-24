import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StudentModal from '../components/StudentModal';
import { Plus, Trash2, Home } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchRooms();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleRoomUpdate = async (studentId, roomNumber) => {
        try {
            await api.put(`/students/${studentId}`, { room_number: roomNumber });
            fetchStudents(); // Refresh to see changes
        } catch (error) {
            alert('Error assigning room: ' + (error.response?.data?.message || error.message));
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
                            <th>Portal Status</th>
                            <th>Lifestyle</th>
                            <th>Phone</th>
                            <th>Room Assignment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No students found</td></tr>
                        ) : (
                            students.map(student => (
                                <tr key={student.id}>
                                    <td style={{ fontWeight: 500 }}>{student.full_name}</td>
                                    <td>
                                        <span className="badge info">{student.student_id}</span>
                                    </td>
                                    <td>
                                        {student.auth_user_id ? (
                                            <span className="badge success">Portal Linked</span>
                                        ) : (
                                            <span className="badge warning">Waiting for Signup</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: '180px' }}>
                                            {[student.sleep_time, student.cleanliness].filter(Boolean).map((p, i) => (
                                                <span key={i} style={{ fontSize: '0.65rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{p}</span>
                                            ))}
                                            {student.roommate_id && <span style={{ fontSize: '0.65rem', background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Matched</span>}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{student.phone}</td>
                                    <td>
                                        <div className="room-selector">
                                            <Home size={14} style={{ color: student.room_number ? 'var(--primary)' : '#9ca3af' }} />
                                            <select 
                                                value={student.room_number || ''}
                                                onChange={(e) => handleRoomUpdate(student.id, e.target.value)}
                                                className="room-dropdown"
                                                title="Assign Room"
                                            >
                                                <option value="">Unassigned</option>
                                                {rooms.map(room => (
                                                    <option 
                                                        key={room.id} 
                                                        value={room.room_number}
                                                        disabled={room.occupancy >= room.capacity && room.room_number !== student.room_number}
                                                    >
                                                        Room {room.room_number} ({room.occupancy}/{room.capacity})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
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


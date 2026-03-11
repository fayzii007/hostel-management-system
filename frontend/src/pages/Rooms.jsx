import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    return (
        <div className="page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Room Management</h2>
                <button className="btn">+ Add Room</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Capacity</th>
                        <th>Occupancy</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>No rooms found</td></tr>
                    ) : (
                        rooms.map(room => (
                            <tr key={room._id}>
                                <td>{room.roomNumber}</td>
                                <td>{room.capacity}</td>
                                <td>{room.occupancy}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        background: room.occupancy >= room.capacity ? '#ffebee' : '#e8f5e9',
                                        color: room.occupancy >= room.capacity ? '#c62828' : '#2e7d32'
                                    }}>
                                        {room.occupancy >= room.capacity ? 'Full' : 'Available'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Rooms;

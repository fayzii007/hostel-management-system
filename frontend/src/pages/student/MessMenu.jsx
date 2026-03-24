import React, { useState } from 'react';

const messMenu = {
    Monday:    { breakfast: 'Idli, Sambar', lunch: 'Rice, Dal, Sabzi', dinner: 'Roti, Paneer' },
    Tuesday:   { breakfast: 'Poha, Tea', lunch: 'Rice, Rajma', dinner: 'Roti, Dal' },
    Wednesday: { breakfast: 'Upma, Chutney', lunch: 'Rice, Chole', dinner: 'Roti, Mix Veg' },
    Thursday:  { breakfast: 'Puri, Aloo', lunch: 'Rice, Dal Makhani', dinner: 'Roti, Shahi Paneer' },
    Friday:    { breakfast: 'Dosa, Sambar', lunch: 'Biryani, Raita', dinner: 'Roti, Dal Fry' },
    Saturday:  { breakfast: 'Bread, Butter', lunch: 'Kadhi, Rice', dinner: 'Noodles' },
    Sunday:    { breakfast: 'Chole Bhature', lunch: 'Special Thali', dinner: 'Roti, Dal' },
};

const MessMenu = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');

    return (
        <div className="page">
            <div className="page-header">
                <h2>🍽️ Mess Menu</h2>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                {Object.keys(messMenu).map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: selectedDay === day ? 'var(--primary)' : 'var(--surface)',
                            color: selectedDay === day ? '#fff' : 'var(--text-muted)',
                            boxShadow: selectedDay === day ? '0 4px 6px rgba(79,70,229,0.2)' : 'var(--shadow-sm)',
                            border: selectedDay === day ? 'none' : '1px solid var(--border)',
                        }}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                    { label: '🌅 Breakfast', meal: 'breakfast', bg: '#FEF3C7', color: '#92400E' },
                    { label: '☀️ Lunch', meal: 'lunch', bg: '#D1FAE5', color: '#065F46' },
                    { label: '🌙 Dinner', meal: 'dinner', bg: '#EEF2FF', color: '#3730A3' },
                ].map((m) => (
                    <div key={m.meal} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ background: m.bg, color: m.color, padding: '14px 20px', fontWeight: 700 }}>{m.label}</div>
                        <div style={{ padding: 20, lineHeight: 1.7, color: 'var(--text-main)' }}>{messMenu[selectedDay][m.meal]}</div>
                    </div>
                ))}
            </div>

            <div className="table-container" style={{ marginTop: 28 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Full Weekly Schedule</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Breakfast</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(messMenu).map(([day, menu]) => (
                            <tr key={day}>
                                <td style={{ fontWeight: 700 }}>{day}</td>
                                <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{menu.breakfast}</td>
                                <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{menu.lunch}</td>
                                <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{menu.dinner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MessMenu;

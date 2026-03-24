import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, X, Loader2, CreditCard, Search, Calendar, ChevronRight } from 'lucide-react';
import './Payments.css';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        amount: '',
        status: 'Paid',
        note: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [payRes, stuRes] = await Promise.all([
                api.get('/payments'),
                api.get('/students')
            ]);
            setPayments(payRes.data);
            setStudents(stuRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/payments/manual', formData);
            alert('Payment recorded successfully!');
            setIsModalOpen(false);
            setFormData({ student_id: '', amount: '', status: 'Paid', note: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error recording payment');
        }
    };

    if (loading) return <div className="loader"><Loader2 className="spin" /></div>;

    return (
        <div className="page animate-in">
            <div className="page-header">
                <div>
                    <h2>Payment Management</h2>
                    <p>Track all student fee payments and record manual transactions.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Record Payment
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student Details</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Method/Note</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr><td colSpan="5" className="empty-row text-center">No transactions recorded</td></tr>
                        ) : (
                            payments.map(px => (
                                <tr key={px.id}>
                                    <td>
                                        <div className="student-info">
                                            <span className="name">{px.students?.full_name || 'N/A'}</span>
                                            <span className="id">ID: {px.student_id?.slice(0, 8)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="amount-box">
                                            <span className="currency">₹</span>
                                            <span className="amount">{px.amount}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-box">
                                            <Calendar size={14} />
                                            <span>{new Date(px.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="note-text">{px.note || (px.razorpay_order_id === 'manual' ? 'Offline Cash' : 'Online razorpay')}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${px.status === 'Paid' ? 'success' : 'danger'}`}>
                                            {px.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manual Payment Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-pop">
                        <div className="modal-header">
                            <h3>Record Manual Payment</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select Student</label>
                                <select 
                                    required
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                                >
                                    <option value="">Choose a student...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.student_id}>
                                            {s.full_name} ({s.room_number})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Amount (₹)</label>
                                <input 
                                    type="number" 
                                    required 
                                    placeholder="Enter amount" 
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Status</label>
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="Paid">Paid (Full)</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Note / Receipt Reference</label>
                                <input 
                                    type="text" 
                                    placeholder="Cash/Online/Bank Transfer" 
                                    value={formData.note}
                                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Record Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus } from 'lucide-react';

const Payments = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payments');
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Payment History</h2>
                <button className="btn">
                    <Plus size={18} /> Record Payment
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>No payments recorded</td></tr>
                        ) : (
                            payments.map(payment => (
                                <tr key={payment.id}>
                                    <td>
                                        <span className="badge info">{payment.studentId}</span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>${payment.amount}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>
                                        {new Date(payment.paymentDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge ${payment.status === 'Paid' ? 'success' : 'danger'}`}>
                                            {payment.status}
                                        </span>
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

export default Payments;

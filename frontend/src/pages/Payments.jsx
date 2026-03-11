import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Payment History</h2>
                <button className="btn">+ Record Payment</button>
            </div>
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
                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>No payments recorded</td></tr>
                    ) : (
                        payments.map(payment => (
                            <tr key={payment._id}>
                                <td>{payment.studentId}</td>
                                <td>${payment.amount}</td>
                                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
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
    );
};

export default Payments;

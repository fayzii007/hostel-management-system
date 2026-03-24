import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, History, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PayFees = () => {
    const { student } = useAuth();
    const [paying, setPaying] = useState(false);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusColor, setStatusColor] = useState('#4F46E5');

    const FEE_AMOUNT = 8500; // Monthly fee

    useEffect(() => {
        if (student) {
            fetchPayments();
        }
    }, [student]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/payments/${student.student_id}`);
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = async () => {
        if (!student) return;
        
        try {
            setPaying(true);
            
            // 1. Create order on backend
            const { data: order } = await api.post('/payments/create-order', {
                amount: FEE_AMOUNT,
                student_id: student.student_id
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SUlGXmN6I5uDzt',
                amount: order.amount,
                currency: order.currency,
                name: "HMS Hostel Fees",
                description: `Monthly Fee - ${new Date().toLocaleString('default', { month: 'long' })}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // 2. Verify payment on backend
                        const { data: verification } = await api.post('/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            student_id: student.student_id,
                            amount: FEE_AMOUNT
                        });

                        alert('🎉 Payment Successful!');
                        fetchPayments(); // Refresh history
                        // Optionally reload or redirect
                    } catch (error) {
                        alert('❌ Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: student.full_name,
                    email: student.email,
                    contact: student.phone
                },
                theme: {
                    color: "#4F46E5"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('❌ Payment Failed: ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('❌ Failed to initialize payment. Try again later.');
        } finally {
            setPaying(false);
        }
    };

    const isPaid = student?.fee_status === 'Paid';

    return (
        <div className="page" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
            <div className="page-header" style={{ marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>💳 Fee Management</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your monthly hostel fee payments</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
                <div className="stat-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
                    <div className="stat-content">
                        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Month</h3>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>₹{FEE_AMOUNT.toLocaleString()}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isPaid ? '#10B981' : '#F59E0B' }}></div>
                            <span style={{ fontSize: '0.85rem', color: isPaid ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                                {isPaid ? 'Paid for this month' : 'Payment Pending'}
                            </span>
                        </div>
                    </div>
                    <div className="stat-icon" style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.1, transform: 'rotate(-15deg)' }}>
                           <CreditCard size={80} />
                    </div>
                </div>

                <div className="stat-card" style={{ padding: 24, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff' }}>
                    <div className="stat-content">
                        <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Balance</h3>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>₹{isPaid ? '0' : FEE_AMOUNT.toLocaleString()}</h2>
                        <p style={{ margin: '12px 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                            {isPaid ? 'No outstanding dues' : 'Due by: 10th of this month'}
                        </p>
                    </div>
                    {!isPaid && (
                        <button 
                            onClick={handlePayNow}
                            disabled={paying}
                            style={{ 
                                marginTop: 16, 
                                width: '100%', 
                                background: '#fff', 
                                color: '#4F46E5', 
                                border: 'none', 
                                borderRadius: 12, 
                                padding: '10px 0', 
                                fontWeight: 700, 
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                filter: paying ? 'grayscale(0.5)' : 'none'
                            }}
                        >
                            {paying ? 'Initializing...' : 'Pay Now →'}
                        </button>
                    )}
                </div>
            </div>

            <div className="card" style={{ borderRadius: 20, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: '#F3F4F6', padding: 10, borderRadius: 12 }}>
                            <History size={20} color="#4B5563" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Payment History</h3>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{payments.length} Transactions</span>
                </div>
                
                <div style={{ padding: '0 8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                <th style={{ padding: '12px 24px' }}>TRANSACTION ID</th>
                                <th style={{ padding: '12px 24px' }}>MONTH / DATE</th>
                                <th style={{ padding: '12px 24px' }}>AMOUNT</th>
                                <th style={{ padding: '12px 24px' }}>STATUS</th>
                                <th style={{ padding: '12px 24px' }}>RECEIPT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading history...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No payment history found.</td>
                                </tr>
                            ) : payments.map((p) => (
                                <tr key={p.id} className="payment-row" style={{ background: '#fff', transition: 'all 0.2s' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 500, fontSize: '0.9rem', color: '#6B7280' }}>
                                        {p.razorpay_payment_id || 'N/A'}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: 600 }}>
                                            {new Date(p.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontWeight: 700, fontSize: '1rem' }}>₹{p.amount.toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span className={`badge ${p.status === 'Paid' ? 'success' : 'warning'}`} 
                                              style={{ 
                                                  padding: '6px 12px', 
                                                  borderRadius: 100, 
                                                  fontWeight: 600, 
                                                  fontSize: '0.75rem',
                                                  background: p.status === 'Paid' ? '#D1FAE5' : '#FEF3C7',
                                                  color: p.status === 'Paid' ? '#065F46' : '#92400E'
                                              }}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button 
                                            style={{ 
                                                background: 'none', 
                                                border: '1px solid #E5E7EB', 
                                                borderRadius: 8, 
                                                padding: '6px 10px', 
                                                cursor: 'pointer',
                                                color: '#4B5563',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                fontSize: '0.8rem'
                                            }}
                                            onClick={() => alert('Receipt feature coming soon!')}
                                        >
                                            <Receipt size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .payment-row:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .badge.success {
                    background: #D1FAE5;
                    color: #065F46;
                }
                .badge.warning {
                    background: #FEF3C7;
                    color: #92400E;
                }
            `}} />
        </div>
    );
};

export default PayFees;

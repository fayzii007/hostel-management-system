import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { 
    Calendar, MapPin, AlignLeft, 
    Send, CheckCircle2, Clock, XCircle, FileText, QrCode 
} from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker-custom.css";
// Standard premium card styles are already loaded globally from index.css

const LeaveGatePass = () => {
    const { student } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        from_date: null,
        to_date: null,
        reason: '',
        destination: ''
    });

    useEffect(() => {
        if (student?.id) fetchLeaves();
    }, [student]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('leave_requests')
                .select('*')
                .eq('student_id', student.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeaves(data || []);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('leave_requests')
                .insert({
                    student_id: student.id,
                    from_date: form.from_date ? form.from_date.toISOString().split('T')[0] : null,
                    to_date: form.to_date ? form.to_date.toISOString().split('T')[0] : null,
                    reason: form.reason.trim(),
                    destination: form.destination.trim()
                });

            if (error) throw error;

            alert('Leave request submitted successfully!');
            setForm({ from_date: null, to_date: null, reason: '', destination: '' });
            fetchLeaves();
        } catch (error) {
            alert('Error submitting request: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStatusBadge = (status) => {
        const styles = {
            'Pending': { bg: '#FEF9C3', color: '#D97706', icon: <Clock size={14} /> },
            'Approved': { bg: '#DCFCE7', color: '#15803D', icon: <CheckCircle2 size={14} /> },
            'Rejected': { bg: '#FEE2E2', color: '#EF4444', icon: <XCircle size={14} /> }
        };
        const s = styles[status] || styles['Pending'];
        return (
            <span style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 6, 
                background: s.bg, color: s.color, padding: '6px 12px', 
                borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 
            }}>
                {s.icon} {status}
            </span>
        );
    };

    return (
        <div className="page animate-in">
            <div className="page-header">
                <h2>Leave & Gate Pass</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Apply for leave and generate your exit QR pass.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                
                {/* ─── APPLY FORM ─── */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 24, paddingBottom: 32, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={20} color="#4F46E5" />
                        </div>
                        <h3 style={{ margin: 0 }}>New Application</h3>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: 8, display: 'block' }}>From Date</label>
                                <div className="dp-custom-input-wrapper">
                                    <Calendar className="dp-icon" size={16} />
                                    <DatePicker
                                        selected={form.from_date}
                                        onChange={(date) => setForm({ ...form, from_date: date, to_date: form.to_date && date > form.to_date ? null : form.to_date })}
                                        selectsStart
                                        startDate={form.from_date}
                                        endDate={form.to_date}
                                        minDate={new Date()}
                                        placeholderText="Select start date"
                                        className="dp-custom-input"
                                        dateFormat="dd/MM/yyyy"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: 8, display: 'block' }}>To Date</label>
                                <div className="dp-custom-input-wrapper">
                                    <Calendar className="dp-icon" size={16} />
                                    <DatePicker
                                        selected={form.to_date}
                                        onChange={(date) => setForm({ ...form, to_date: date })}
                                        selectsEnd
                                        startDate={form.from_date}
                                        endDate={form.to_date}
                                        minDate={form.from_date || new Date()}
                                        placeholderText="Select end date"
                                        className="dp-custom-input"
                                        dateFormat="dd/MM/yyyy"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: 8, display: 'block' }}>Destination (Optional)</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 12, padding: '0 12px' }}>
                                <MapPin size={16} color="#94A3B8" />
                                <input type="text" name="destination" placeholder="Where are you going?" value={form.destination} onChange={handleChange} style={{ border: 'none', background: 'transparent', width: '100%', padding: '12px', outline: 'none', color: 'var(--text-main)' }} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: 8, display: 'block' }}>Reason for Leave</label>
                            <div style={{ display: 'flex', alignItems: 'flex-start', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 12, padding: '12px' }}>
                                <AlignLeft size={16} color="#94A3B8" style={{ marginTop: 2, marginRight: 8 }} />
                                <textarea name="reason" placeholder="Please provide details..." value={form.reason} onChange={handleChange} required style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-main)', resize: 'none', minHeight: '80px', fontFamily: 'inherit' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={submitting} style={{ 
                            background: 'var(--primary)', color: 'white', border: 'none', 
                            padding: '14px', borderRadius: 12, fontWeight: 700, 
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, 
                            cursor: submitting ? 'not-allowed' : 'pointer', marginTop: 8 
                        }}>
                            {submitting ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
                        </button>
                    </form>
                </div>

                {/* ─── HISTORY & QR CODES ─── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', paddingBottom: 8, borderBottom: '1px solid var(--border-light)' }}>Leave History</h3>
                    
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                                <Skeleton width="40%" height="20px" marginBottom="12px" />
                                <Skeleton width="100%" height="14px" marginBottom="8px" />
                                <Skeleton width="80%" height="14px" />
                            </div>
                        ))
                    ) : leaves.length === 0 ? (
                        <div style={{ background: '#fff', padding: 40, textAlign: 'center', borderRadius: 16, border: '1px dashed var(--border)' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No leave requests found.</p>
                        </div>
                    ) : (
                        leaves.map(req => {
                            const isApproved = req.status === 'Approved';
                            const qrData = JSON.stringify({
                                id: req.id,
                                student: student?.full_name,
                                room: student?.room_number,
                                from: req.from_date,
                                to: req.to_date
                            });

                            return (
                                <div key={req.id} style={{ 
                                    background: '#fff', borderRadius: 16, padding: 24, 
                                    border: '1px solid', borderColor: isApproved ? '#BBF7D0' : 'var(--border)', 
                                    boxShadow: isApproved ? '0 8px 30px rgba(34, 197, 94, 0.1)' : 'var(--shadow-sm)',
                                    display: 'flex', flexDirection: 'column', gap: 16,
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    {isApproved && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#22C55E' }} />
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '0.95rem' }}>
                                                {new Date(req.from_date).toLocaleDateString('en-GB')}  —  {new Date(req.to_date).toLocaleDateString('en-GB')}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }}/> 
                                                {req.destination || 'Not specified'}
                                            </p>
                                        </div>
                                        {renderStatusBadge(req.status)}
                                    </div>

                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-soft)', lineHeight: 1.5, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
                                        {req.reason}
                                    </p>

                                    {/* ─── QR CODE FOR APPROVED GATE PASS ─── */}
                                    {isApproved && (
                                        <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center', gap: 20 }}>
                                            <div style={{ background: '#fff', p: 4, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`} 
                                                    alt="Gate Pass QR" 
                                                    style={{ display: 'block', borderRadius: 8 }}
                                                />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px', color: '#15803D', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <QrCode size={18} /> Valid Gate Pass
                                                </h4>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                                                    Show this QR to the warden/security when leaving the premises.
                                                </p>
                                                <a 
                                                    href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrData)}`} 
                                                    download="GatePass.png" 
                                                    target="_blank" rel="noreferrer"
                                                    style={{ 
                                                        display: 'inline-flex', padding: '6px 12px', background: '#F0FDF4', 
                                                        color: '#166534', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, 
                                                        textDecoration: 'none', border: '1px solid #BBF7D0' 
                                                    }}>
                                                    Download QR Code
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveGatePass;

import React, { useState, useEffect } from 'react';
import { 
    ArrowRightLeft, Check, X, Clock, 
    History, Search, Filter, Loader2, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import './AdminSwaps.css';

const AdminSwaps = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Premium UI State
    const [toast, setToast] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeSwapInfo, setActiveSwapInfo] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/swap/admin/all');
            setRequests(data);
        } catch (error) {
            console.error('Fetch error:', error);
            showToast('Failed to sync data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminAction = async (requestId, action, requestData) => {
        setActionLoading(true);
        try {
            const { data } = await api.post('/swap/admin/handle', { requestId, action });
            
            if (action === 'admin_approved') {
                setActiveSwapInfo(requestData);
                setShowSuccessModal(true);
            } else {
                showToast('Swap request rejected by admin', 'success');
            }
            
            fetchRequests();
        } catch (error) {
            showToast(error.response?.data?.message || 'Transaction failed', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'all' || req.status === filter;
        const searchStr = `${req.requester?.full_name} ${req.target?.full_name}`.toLowerCase();
        const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': return { label: 'Waiting for Students', class: 'pending' };
            case 'accepted': return { label: 'Awaiting Approval', class: 'accepted' };
            case 'admin_approved': return { label: 'Approved & Swapped', class: 'approved' };
            case 'admin_rejected': return { label: 'Rejected by Admin', class: 'rejected' };
            case 'rejected': return { label: 'Rejected by Student', class: 'rejected' };
            default: return { label: status, class: 'default' };
        }
    };

    if (loading) return <div className="admin-loader"><Loader2 className="spin" /></div>;

    return (
        <div className="admin-page animate-in">
            <div className="admin-header">
                <div>
                    <h2>Room Swap Management</h2>
                    <p>Review and authorize student room exchange requests.</p>
                </div>
                
                <div className="admin-stats">
                    <div className="stat-item">
                        <span className="count">{requests.filter(r => r.status === 'accepted').length}</span>
                        <span className="label">Awaiting Approval</span>
                    </div>
                </div>
            </div>

            <div className="admin-controls">
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={18} />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending (Students)</option>
                        <option value="accepted">Accepted (Ready for Admin)</option>
                        <option value="admin_approved">Approved History</option>
                        <option value="admin_rejected">Rejected History</option>
                    </select>
                </div>
            </div>

            <div className="requests-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Exchange Participants</th>
                            <th>Current Rooms</th>
                            <th>Requested On</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-row">No requests found matching your criteria.</td>
                            </tr>
                        ) : (
                            filteredRequests.map(req => {
                                const badge = getStatusBadge(req.status);
                                return (
                                    <tr key={req.id}>
                                        <td>
                                            <div className="swap-pair">
                                                <span className="name">{req.requester?.full_name}</span>
                                                <ArrowRightLeft size={14} className="swap-icon" />
                                                <span className="name">{req.target?.full_name}</span>
                                            </div>
                                            <div className="course-info">
                                                {req.requester?.course} & {req.target?.course}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="rooms-pair">
                                                <span className="room">#{req.requester?.room_number}</span>
                                                <span className="room">#{req.target?.room_number}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`admin-badge ${badge.class}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td>
                                            {req.status === 'accepted' ? (
                                                <div className="admin-actions">
                                                    <button 
                                                        className="btn-approve" 
                                                        onClick={() => handleAdminAction(req.id, 'admin_approved', req)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                    <button 
                                                        className="btn-reject" 
                                                        onClick={() => handleAdminAction(req.id, 'admin_rejected', req)}
                                                        disabled={actionLoading}
                                                    >
                                                        <X size={16} /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="history-text">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Notification Toast */}
            {toast && (
                <div className={`custom-toast ${toast.type}`}>
                    {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Success Celebration Modal */}
            {showSuccessModal && activeSwapInfo && (
                <div className="success-overlay">
                    <div className="success-modal">
                        <div className="icon-circle">
                            <ArrowRightLeft size={40} />
                        </div>
                        <h3>Swap Authorized!</h3>
                        <p>The room exchange has been processed. Syncing room occupancy and updating records now.</p>
                        
                        <div className="swap-visual">
                            <div className="avatar-box">
                                <div className="circle">{activeSwapInfo.requester?.full_name[0]}</div>
                                <span className="label">Room {activeSwapInfo.target?.room_number}</span>
                            </div>
                            <ArrowRightLeft className="swap-icon" size={32} />
                            <div className="avatar-box">
                                <div className="circle">{activeSwapInfo.target?.full_name[0]}</div>
                                <span className="label">Room {activeSwapInfo.requester?.room_number}</span>
                            </div>
                        </div>

                        <button className="btn-dismiss" onClick={() => setShowSuccessModal(false)}>
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSwaps;

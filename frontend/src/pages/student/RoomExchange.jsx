import React, { useState, useEffect } from 'react';
import { 
    Repeat, Users, Clock, Check, X, 
    ArrowRightLeft, AlertCircle, Loader2, Search,
    MessageSquare, Home, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './RoomExchange.css';

const RoomExchange = () => {
    const { student } = useAuth();
    const [wantsChange, setWantsChange] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('suggestions'); // updated default tab

    useEffect(() => {
        if (student) {
            setWantsChange(student.wants_room_change);
            fetchData();
        }
    }, [student]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [candRes, reqRes, sugRes] = await Promise.all([
                api.get(`/swap/candidates?exclude=${student.id}`),
                api.get(`/swap/requests/${student.id}`),
                api.get(`/swap/suggestions/${student.id}`)
            ]);
            setCandidates(candRes.data);
            setRequests(reqRes.data);
            setSuggestions(sugRes.data);
        } catch (error) {
            console.error('Data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        try {
            const newStatus = !wantsChange;
            await api.post('/swap/toggle-status', { studentId: student.id, status: newStatus });
            setWantsChange(newStatus);
            if (newStatus) fetchData();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const sendRequest = async (targetId) => {
        setActionLoading(true);
        try {
            await api.post('/swap/request', {
                requesterId: student.id,
                targetId,
                reason: 'Mutual interest in swapping rooms'
            });
            alert('Swap request sent!');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error sending request');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequest = async (requestId, action) => {
        setActionLoading(true);
        try {
            const { data } = await api.post('/swap/handle', { requestId, action });
            alert(data.message);
            if (action === 'accepted') {
                window.location.reload(); // Refresh everything on swap success
            } else {
                fetchData();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error handling request');
        } finally {
            setActionLoading(false);
        }
    };

    const isRequestSent = (targetId) => {
        return requests.outgoing.some(r => r.target_id === targetId && r.status === 'pending');
    };

    if (loading) return <div className="page-loader"><Loader2 className="spin" /></div>;

    return (
        <div className="page animate-in">
            <div className="page-header">
                <div>
                    <div className="title-with-icon">
                        <ArrowRightLeft className="header-icon" />
                        <h2>Room Exchange Hub</h2>
                    </div>
                    <p className="subtitle">Mutual room swapping with fellow students.</p>
                </div>

                <button 
                    className={`status-toggle ${wantsChange ? 'active' : ''}`}
                    onClick={toggleStatus}
                    disabled={actionLoading}
                >
                    {wantsChange ? <Repeat size={18} /> : <Home size={18} />}
                    <span>{wantsChange ? 'I want to Swap' : 'Keep my Room'}</span>
                </button>
            </div>

            {/* Main Tabs */}
            <div className="exchange-tabs">
                <button className={activeTab === 'suggestions' ? 'active' : ''} onClick={() => setActiveTab('suggestions')}>
                    <Sparkles size={16} /> Best Matches
                </button>
                <button className={activeTab === 'browse' ? 'active' : ''} onClick={() => setActiveTab('browse')}>
                    <Search size={16} /> All Candidates
                </button>
                <button className={activeTab === 'incoming' ? 'active' : ''} onClick={() => setActiveTab('incoming')}>
                    <Users size={16} /> Incoming {requests.incoming.length > 0 && <span className="count">{requests.incoming.length}</span>}
                </button>
                <button className={activeTab === 'outgoing' ? 'active' : ''} onClick={() => setActiveTab('outgoing')}>
                    <Clock size={16} /> My Requests
                </button>
            </div>

            <div className="content-area">
                {!wantsChange && (activeTab === 'browse' || activeTab === 'suggestions') && (
                    <div className="status-notice">
                        <AlertCircle />
                        <p>Turn on <b>"I want to Swap"</b> to see AI-suggested matches and candidates looking for an exchange.</p>
                    </div>
                )}

                {wantsChange && activeTab === 'suggestions' && (
                    <div className="suggestions-container">
                        <div className="discovery-header">
                            <Sparkles size={24} className="sparkle" />
                            <div>
                                <h3>AI Matching Hub</h3>
                                <p>We've found {suggestions.length} students who would be a great fit for you.</p>
                            </div>
                        </div>

                        <div className="suggestions-grid">
                            {suggestions.length === 0 ? (
                                <div className="empty-state">No compatible matches found yet. Try checking the "All Candidates" tab.</div>
                            ) : (
                                suggestions.map(sug => {
                                    const getScoreLabel = (score) => {
                                        if (score === 4) return { text: "Perfect Match 💯", class: "perfect" };
                                        if (score === 3) return { text: "Great Match 🔥", class: "great" };
                                        return { text: "Moderate Match 👍", class: "moderate" };
                                    };
                                    const label = getScoreLabel(sug.score);

                                    return (
                                        <div key={sug.id} className="suggestion-card animate-in">
                                            <div className="match-percent-circle">
                                                <svg viewBox="0 0 36 36" className="circular-chart">
                                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    <path className="circle" strokeDasharray={`${sug.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                </svg>
                                                <div className="percentage-text">{sug.percentage}%</div>
                                            </div>

                                            <div className="sug-content">
                                                <div className="sug-header">
                                                    <span className={`match-label ${label.class}`}>{label.text}</span>
                                                    <h4>{sug.full_name}</h4>
                                                    <p>Currently in <b>Room {sug.room_number}</b></p>
                                                </div>
                                                
                                                <div className="match-reasons">
                                                    <p className="reason-title">Matching Traits:</p>
                                                    <div className="tags">
                                                        {sug.matches.map((m, i) => (
                                                            <span key={i} className="match-tag">
                                                                <Check size={12} /> {m}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button 
                                                    disabled={isRequestSent(sug.id) || actionLoading}
                                                    onClick={() => sendRequest(sug.id)}
                                                    className={`sug-btn ${isRequestSent(sug.id) ? 'sent' : 'request'}`}
                                                >
                                                    {isRequestSent(sug.id) ? <Check size={16} /> : <ArrowRightLeft size={16} />}
                                                    {isRequestSent(sug.id) ? 'Request Sent' : 'Request Swap'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {wantsChange && activeTab === 'browse' && (
                    <div className="candidates-grid">
                        {candidates.length === 0 ? (
                            <div className="empty-state">No other students looking for a swap right now.</div>
                        ) : (
                            candidates.map(cand => (
                                <div key={cand.id} className="swap-card">
                                    <div className="card-top">
                                        <div className="avatar">{cand.full_name[0]}</div>
                                        <div className="info">
                                            <h4>{cand.full_name}</h4>
                                            <p>{cand.course}</p>
                                        </div>
                                        <div className="room-badge">Room {cand.room_number}</div>
                                    </div>
                                    
                                    <div className="card-lifestyle">
                                        <span>{cand.sleep_time}</span>
                                        <span>{cand.cleanliness}</span>
                                    </div>

                                    <div className="card-footer">
                                        <button 
                                            disabled={isRequestSent(cand.id) || actionLoading}
                                            onClick={() => sendRequest(cand.id)}
                                            className={isRequestSent(cand.id) ? 'sent' : 'request'}
                                        >
                                            {isRequestSent(cand.id) ? <Check size={16} /> : <ArrowRightLeft size={16} />}
                                            {isRequestSent(cand.id) ? 'Request Sent' : 'Request Swap'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'incoming' && (
                    <div className="requests-list">
                        {requests.incoming.length === 0 ? (
                            <div className="empty-state">No incoming swap requests.</div>
                        ) : (
                            requests.incoming.map(req => (
                                <div key={req.id} className="request-item incoming">
                                    <div className="req-user">
                                        <div className="avatarSmall">{req.requester.full_name[0]}</div>
                                        <div>
                                            <strong>{req.requester.full_name}</strong>
                                            <p>Wants to swap with your Room {student.room_number}</p>
                                        </div>
                                    </div>
                                    <div className="req-from">
                                        From Room <b>{req.requester.room_number}</b>
                                    </div>
                                    <div className="req-actions">
                                        <button className="accept" onClick={() => handleRequest(req.id, 'accepted')}>
                                            <Check size={18} /> Accept
                                        </button>
                                        <button className="reject" onClick={() => handleRequest(req.id, 'rejected')}>
                                            <X size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'outgoing' && (
                    <div className="requests-list">
                        {requests.outgoing.length === 0 ? (
                            <div className="empty-state">You haven't sent any swap requests.</div>
                        ) : (
                            requests.outgoing.map(req => (
                                <div key={req.id} className="request-item outgoing">
                                    <div className="req-user">
                                        <div className="avatarSmall">{req.target.full_name[0]}</div>
                                        <div>
                                            <strong>{req.target.full_name}</strong>
                                            <p>Requested their Room {req.target.room_number}</p>
                                        </div>
                                    </div>
                                    <div className="req-status-tag">
                                        <span className={`status ${req.status}`}>{req.status}</span>
                                    </div>
                                    <div className="req-date">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomExchange;

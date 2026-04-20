import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, RotateCcw, User, Star, Loader2, Info } from 'lucide-react';
import api from '../services/api';
import './RoommateMatcher.css';

const RoommateMatcher = ({ studentId, onMatchAccepted }) => {
    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState(null);
    const [error, setError] = useState(null);
    const [accepting, setAccepting] = useState(false);

    const fetchMatch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/students/find-match/${studentId}`);
            const data = response.data;
            if (data.found) {
                setMatch(data.match);
            } else {
                setMatch(null);
                setError(data.message || 'No strong match found');
            }
        } catch (err) {
            setError('Failed to fetch match');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (studentId) fetchMatch();
    }, [studentId]);

    const handleAccept = async () => {
        if (!match) return;
        setAccepting(true);
        try {
            const response = await api.post('/students/accept-match', {
                studentId,
                roommateId: match.id
            });
            const data = response.data;
            if (response.status === 200) {
                onMatchAccepted(data.room_number);
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Error accepting match');
        } finally {
            setAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="matcher-container loading">
                <Loader2 className="spin" size={32} />
                <p>Finding your perfect roommate...</p>
            </div>
        );
    }

    if (error || !match) {
        return (
            <div className="matcher-container empty">
                <div className="empty-icon">
                    <Info size={32} />
                </div>
                <h3>{error || 'No matches found yet'}</h3>
                <p>We're looking for students with similar lifestyles. Please check back later or try refreshing.</p>
                <button onClick={fetchMatch} className="refresh-btn">
                    <RotateCcw size={18} />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    const getScoreBadge = (score) => {
        if (score >= 4) return { label: 'Perfect Match', class: 'high' };
        if (score >= 3) return { label: 'Strong Match', class: 'medium' };
        return { label: 'Good Match', class: 'low' };
    };

    const badge = getScoreBadge(match.score);

    return (
        <div className="matcher-container found">
            <div className="matcher-header">
                <div className="sparkle-title">
                    <Sparkles size={20} className="sparkle-icon" />
                    <h3>Smart Roommate Suggestion</h3>
                </div>
                <div className={`compatibility-badge ${badge.class}`}>
                    {badge.label}
                </div>
            </div>

            <div className="match-card">
                <div className="match-user-info">
                    <div className="match-avatar">
                        <User size={24} />
                    </div>
                    <div className="match-details">
                        <h4>{match.full_name}</h4>
                        <p>{match.course}</p>
                    </div>
                    <div className="match-score">
                        <div className="score-stars">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} size={16} fill={i < match.score ? "#FBBF24" : "none"} color={i < match.score ? "#FBBF24" : "#D1D5DB"} />
                            ))}
                        </div>
                        <span>{(match.score / 4) * 100}% Compatible</span>
                    </div>
                </div>

                <div className="preferences-tags">
                    {Object.entries(match.preferences).map(([key, value]) => (
                        <div key={key} className="pref-tag">
                            <Check size={14} />
                            <span>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="match-actions">
                    <button onClick={handleAccept} className="accept-btn" disabled={accepting}>
                        {accepting ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
                        <span>Accept Match</span>
                    </button>
                    <button onClick={fetchMatch} className="decline-btn" disabled={accepting}>
                        <RotateCcw size={18} />
                        <span>Find Another</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoommateMatcher;

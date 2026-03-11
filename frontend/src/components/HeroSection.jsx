import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <div className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="hero-title">Your Home Away From Home</h1>
                <p className="hero-subtitle">
                    Empowering students with world-class education and opportunities.
                </p>
                <div className="hero-buttons">
                    <button className="primary-btn" onClick={() => navigate('/dashboard')}>Login</button>
                    <button className="secondary-btn">Contact Us</button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

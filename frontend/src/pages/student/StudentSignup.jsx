import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    User, Mail, Phone, BookOpen, Lock, Eye, EyeOff, 
    ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, AtSign 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Aurora from '../../components/Aurora';
import './StudentSignup.css';

const StudentSignup = () => {
    const [form, setForm] = useState({ 
        fullName: '', 
        email: '', 
        studentId: '', // Added 📝
        phone: '', 
        course: '', 
        password: '',
        confirmPassword: '',
        sleepTime: '',
        cleanliness: '',
        studyPreference: '',
        noiseTolerance: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleChange = (e) => { 
        setForm({ ...form, [e.target.name]: e.target.value }); 
        if (error) setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (form.password.length < 6) { 
            setError('Password must be 6+ characters'); 
            return; 
        }

        setLoading(true);
        try {
            const signupData = {
                email: form.email.trim(),
                password: form.password,
                fullName: form.fullName.trim(),
                studentId: form.studentId.trim(), // Using real studentId 📝
                phone: form.phone.trim(),
                course: form.course.trim(),
                sleepTime: form.sleepTime,
                cleanliness: form.cleanliness,
                studyPreference: form.studyPreference,
                noiseTolerance: form.noiseTolerance
            };

            const { user } = await signUp(signupData);

            if (user) {
                localStorage.setItem('isStudentAuthenticated', 'true');
                navigate('/student/dashboard');
            } else {
                setError('Registration successful! Please login.');
            }
        } catch (err) {
            console.error('Signup Error:', err);
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const features = [
        "Real-time room status",
        "Fee payment tracking",
        "Complaint management",
        "Daily mess menu",
        "Notice board"
    ];

    return (
        <div className="signup-premium-page">
            <div className="signup-premium-container animate-in">

                {/* Left Side - Banner */}
                <div className="signup-banner">
                    <div className="banner-grid-pattern"></div>
                    <div className="banner-content">
                        <div className="banner-logo-section">
                            <div className="banner-logo">
                                <Sparkles size={24} className="logo-icon" />
                                <span>HMS<b>Pro</b></span>
                            </div>
                            <span className="portal-badge">STUDENT PORTAL</span>
                        </div>

                        <div className="banner-text">
                            <h1>Your hostel,<br />one app away.</h1>
                            <p>Register to manage your room, fees, complaints, and stay connected with your hostel community.</p>
                        </div>

                        <ul className="feature-list">
                            {features.map((feature, index) => (
                                <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CheckCircle2 size={20} className="check-icon" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="signup-form-section">
                    <div className="form-header">
                        <h2>Create Student Account</h2>
                        <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>

                    <div className="status-alert">
                        <CheckCircle2 size={18} />
                        <span>Student ID & Email setup active</span>
                    </div>

                    <form onSubmit={handleSubmit} className="premium-form">
                        <div className="form-group-full">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input 
                                    name="fullName" 
                                    placeholder="e.g. Khalid Naufal" 
                                    value={form.fullName} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group-full">
                            <label>Email ID</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input 
                                    type="email"
                                    name="email" 
                                    placeholder="kh@gmail.com" 
                                    value={form.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Student ID</label>
                                <div className="input-wrapper">
                                    <AtSign size={18} className="input-icon" />
                                    <input 
                                        name="studentId" 
                                        placeholder="e.g. STU101" 
                                        value={form.studentId} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-wrapper">
                                    <Phone size={18} className="input-icon" />
                                    <input 
                                        name="phone" 
                                        placeholder="1234567899" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Course / Dept</label>
                                <div className="input-wrapper">
                                    <BookOpen size={18} className="input-icon" />
                                    <input 
                                        name="course" 
                                        placeholder="BCA" 
                                        value={form.course} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="••••••••••••" 
                                        value={form.password} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group-full">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    placeholder="••••••••••••" 
                                    value={form.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="toggle-visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-section-divider">
                            <span>Roommate Matching Preferences</span>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Sleep Time 😴</label>
                                <div className="input-wrapper">
                                    <select name="sleepTime" value={form.sleepTime} onChange={handleChange} className="premium-select">
                                        <option value="" disabled>Select</option>
                                        <option value="Early Sleeper">Early Sleeper 🌅</option>
                                        <option value="Night Owl">Night Owl 🌙</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Cleanliness 🧹</label>
                                <div className="input-wrapper">
                                    <select name="cleanliness" value={form.cleanliness} onChange={handleChange} className="premium-select">
                                        <option value="" disabled>Select</option>
                                        <option value="Very Clean">Very Clean 🧹</option>
                                        <option value="Moderate">Moderate 😐</option>
                                        <option value="Messy">Messy 🙈</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Study Preference 📚</label>
                                <div className="input-wrapper">
                                    <select name="studyPreference" value={form.studyPreference} onChange={handleChange} className="premium-select">
                                        <option value="" disabled>Select</option>
                                        <option value="Quiet Environment">Quiet Environment 🤫</option>
                                        <option value="Flexible">Flexible 🤷‍♂️</option>
                                        <option value="Group Discussion">Group/Discussion 🗣️</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Noise Tolerance 🔊</label>
                                <div className="input-wrapper">
                                    <select name="noiseTolerance" value={form.noiseTolerance} onChange={handleChange} className="premium-select">
                                        <option value="" disabled>Select</option>
                                        <option value="Low">Low 🔇</option>
                                        <option value="Medium">Medium 🔉</option>
                                        <option value="High">High 🔊</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {error && <div className="form-error"><AlertCircle size={16} /> {error}</div>}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? <Loader2 className="spin" size={20} /> : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentSignup;



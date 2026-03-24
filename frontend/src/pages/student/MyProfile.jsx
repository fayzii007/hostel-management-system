import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, BookOpen, Edit2, Check, X, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

const Field = ({ label, field, value, editing, onChange, readOnly }) => (
    <div>
        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
        </p>
        {editing && !readOnly ? (
            <input
                value={value || ''}
                onChange={e => onChange(field, e.target.value)}
                style={{
                    width: '100%', padding: '8px 12px',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--radius-md)', fontSize: '0.9rem',
                    outline: 'none', background: '#F5F3FF', color: 'var(--text-main)',
                    fontFamily: 'inherit',
                }}
            />
        ) : (
            <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{value || 'N/A'}</p>
        )}
    </div>
);

const MyProfile = () => {
    const { student, authUser } = useAuth();
    const [draft, setDraft] = useState({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [photo, setPhoto] = useState(() => localStorage.getItem('studentPhoto') || null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (student) {
            setDraft(student);
        } else if (authUser?.user_metadata) {
            // Fallback to metadata if DB record isn't ready
            setDraft({
                full_name: authUser.user_metadata.full_name,
                student_id: authUser.user_metadata.student_id,
                phone: authUser.user_metadata.phone,
                course: authUser.user_metadata.course,
                email: authUser.email
            });
        }
    }, [student, authUser]);

    const handlePhotoChange = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            setPhoto(dataUrl);
            localStorage.setItem('studentPhoto', dataUrl);
            window.dispatchEvent(new Event('storage'));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('students')
                .update({
                    full_name: draft.full_name,
                    phone: draft.phone,
                    course: draft.course,
                })
                .eq('id', student.id);
            
            if (error) throw error;
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Update error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    if (!student && !authUser) return <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Loader2 className="spin" /></div>;

    const displayData = {
        name:      student?.full_name || authUser?.user_metadata?.full_name || 'Student',
        studentId: student?.student_id || authUser?.user_metadata?.student_id || 'ST-XXXX-000',
        course:    student?.course || authUser?.user_metadata?.course || 'Not Assigned',
        email:     student?.email || authUser?.email || 'N/A',
        phone:     student?.phone || authUser?.user_metadata?.phone || 'N/A',
        room:      student?.room_number || 'Unassigned',
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>👤 My Profile</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    {editing ? (
                        <>
                            <button className="btn" onClick={handleSave} disabled={loading} style={{ background: '#10B981' }}>
                                {loading ? <Loader2 className="spin" size={15} /> : <Check size={15} />} Save Changes
                            </button>
                            <button className="btn" onClick={() => { setEditing(false); setDraft(student); }} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', boxShadow: 'none' }}>
                                <X size={15} /> Cancel
                            </button>
                        </>
                    ) : (
                        <button className="btn" onClick={() => setEditing(true)}>
                            <Edit2 size={15} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', height: 'fit-content' }}>
                    <div
                        style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 16px', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={e => handlePhotoChange(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        {photo ? (
                            <img src={photo} alt="Profile" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 700 }}>
                                {displayData.name[0]}
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                            <Camera size={14} />
                        </div>
                    </div>

                    <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{displayData.name}</h3>
                    <p style={{ margin: '0 0 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{displayData.studentId}</p>
                    <span className="badge info" style={{ fontSize: '0.75rem' }}>{displayData.course}</span>

                    <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <Mail size={16} /> <span style={{ fontWeight: 500 }}>{displayData.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <Phone size={16} /> <span style={{ fontWeight: 500 }}>{displayData.phone}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, gridColumn: 'span 2' }}>
                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ margin: '0 0 24px', fontSize: '1.1rem', fontWeight: 800 }}>Personal Information</h3>
                        {saved && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontWeight: 700 }}>✓ Changes saved successfully!</div>}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                            <Field label="Full Name"     field="full_name" value={draft.full_name} editing={editing} onChange={handleChange} />
                            <Field label="Email Address" field="email"     value={displayData.email} readOnly />
                            <Field label="Phone Number"  field="phone"     value={draft.phone}     editing={editing} onChange={handleChange} />
                            <Field label="Course / Dept" field="course"    value={draft.course}    editing={editing} onChange={handleChange} />
                            <Field label="Student ID"    field="studentId" value={displayData.studentId} readOnly />
                            <Field label="Assigned Room"  field="roomNumber" value={displayData.room}     readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

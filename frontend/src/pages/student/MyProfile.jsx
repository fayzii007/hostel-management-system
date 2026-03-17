import React, { useState, useRef } from 'react';
import { Mail, Phone, BookOpen, Edit2, Check, X, Camera } from 'lucide-react';

const initialProfile = {
    name: 'Mohammed Fayaz VP',
    studentId: 'ST-2024-001',
    course: 'B.Tech Computer Science',
    department: 'Engineering',
    year: '2nd Year',
    email: 'fayaz.vp@student.edu',
    phone: '+91 98765 43210',
    dob: '2003-05-12',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98234 56789',
    address: 'Flat 5, Lakeview Apartments, Pune, Maharashtra - 411021',
    roomNumber: '100',
    joinedOn: 'July 2024',
};

const Field = ({ label, field, value, editing, onChange, readOnly }) => (
    <div>
        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
        </p>
        {editing && !readOnly ? (
            <input
                value={value}
                onChange={e => onChange(field, e.target.value)}
                style={{
                    width: '100%', padding: '8px 12px',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--radius-md)', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box',
                    background: '#F5F3FF', color: 'var(--text-main)',
                    fontFamily: 'inherit',
                }}
            />
        ) : (
            <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{value}</p>
        )}
    </div>
);

const MyProfile = () => {
    const [profile, setProfile] = useState(initialProfile);
    const [draft, setDraft] = useState(initialProfile);
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [photo, setPhoto] = useState(() => localStorage.getItem('studentPhoto') || null);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            setPhoto(dataUrl);
            localStorage.setItem('studentPhoto', dataUrl);
            // dispatch storage event so Header/Sidebar update too
            window.dispatchEvent(new Event('storage'));
        };
        reader.readAsDataURL(file);
    };

    const handleFileInput = (e) => handlePhotoChange(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handlePhotoChange(e.dataTransfer.files[0]);
    };

    const handleChange = (field, value) => setDraft(prev => ({ ...prev, [field]: value }));

    const handleSave = () => {
        setProfile(draft);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleCancel = () => {
        setDraft(profile);
        setEditing(false);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>👤 My Profile</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    {editing ? (
                        <>
                            <button className="btn" onClick={handleSave} style={{ background: '#10B981' }}>
                                <Check size={15} /> Save Changes
                            </button>
                            <button className="btn" onClick={handleCancel} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', boxShadow: 'none' }}>
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

            {saved && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 20px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={16} /> Profile updated successfully!
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
                {/* Profile Card */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', height: 'fit-content' }}>

                    {/* Avatar with upload */}
                    <div
                        style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 16px', cursor: 'pointer' }}
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        title="Click or drag & drop to upload photo"
                    >
                        {/* Hidden file input — works on both mobile & desktop */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />

                        {/* Photo or initials */}
                        {photo ? (
                            <img
                                src={photo}
                                alt="Profile"
                                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: dragging ? '3px dashed var(--primary)' : '3px solid #EEF2FF', transition: 'border 0.2s' }}
                            />
                        ) : (
                            <div style={{
                                width: 96, height: 96, borderRadius: '50%',
                                background: dragging ? '#EEF2FF' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: dragging ? 'var(--primary)' : '#fff',
                                fontSize: dragging ? '1rem' : '2.5rem', fontWeight: 700,
                                border: dragging ? '3px dashed var(--primary)' : '3px solid transparent',
                                transition: 'all 0.2s',
                            }}>
                                {dragging ? '📁' : profile.name[0]}
                            </div>
                        )}

                        {/* Camera overlay */}
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'var(--primary)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            border: '2px solid #fff',
                        }}>
                            <Camera size={14} />
                        </div>
                    </div>

                    <p style={{ margin: '0 0 12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Click or drag & drop to change photo
                    </p>

                    <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>{profile.name}</h3>
                    <p style={{ margin: '0 0 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{profile.studentId}</p>
                    <span className="badge info" style={{ fontSize: '0.75rem' }}>{profile.course}</span>

                    <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'left' }}>
                        {[
                            { icon: <Mail size={14} />, value: profile.email },
                            { icon: <Phone size={14} />, value: profile.phone },
                            { icon: <BookOpen size={14} />, value: `${profile.year} · ${profile.department}` },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.85rem', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Personal */}
                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 28, border: editing ? '1.5px solid var(--primary)' : '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700 }}>Personal Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Full Name"     field="name"   value={draft.name}   editing={editing} onChange={handleChange} />
                            <Field label="Date of Birth" field="dob"    value={draft.dob}    editing={editing} onChange={handleChange} />
                            <Field label="Email Address" field="email"  value={draft.email}  editing={editing} onChange={handleChange} />
                            <Field label="Phone Number"  field="phone"  value={draft.phone}  editing={editing} onChange={handleChange} />
                            <Field label="Course"        field="course" value={draft.course} editing={editing} onChange={handleChange} />
                            <Field label="Year"          field="year"   value={draft.year}   editing={editing} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Parent */}
                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 28, border: editing ? '1.5px solid var(--primary)' : '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700 }}>Parent / Guardian</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Parent Name"  field="parentName"  value={draft.parentName}  editing={editing} onChange={handleChange} />
                            <Field label="Parent Phone" field="parentPhone" value={draft.parentPhone} editing={editing} onChange={handleChange} />
                            <Field label="Home Address" field="address"     value={draft.address}     editing={editing} onChange={handleChange} />
                            <Field label="Room Number"  field="roomNumber"  value={draft.roomNumber}  readOnly onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

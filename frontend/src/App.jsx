import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Complaints from './pages/Complaints';
import Payments from './pages/Payments';
import AdminSwaps from './pages/AdminSwaps';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentSidebar from './components/StudentSidebar';

// Student pages
import StudentSignup from './pages/student/StudentSignup';
import StudentDashboard from './pages/student/StudentDashboard';
import MyRoom from './pages/student/MyRoom';
import PayFees from './pages/student/PayFees';
import MessMenu from './pages/student/MessMenu';
import RaiseComplaint from './pages/student/RaiseComplaint';
import Notices from './pages/student/Notices';
import MyProfile from './pages/student/MyProfile';
import RoomExchange from './pages/student/RoomExchange';

// ─── Route Guards ────────────────────────────────────────────────
const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const StudentPrivateRoute = () => {
  const { authUser, loading } = useAuth();
  
  // ⚡ IMPROVEMENT: If we have an authUser, let them in IMMEDIATELY.
  // We only show the full-screen loader if we really have no idea who the user is yet.
  if (loading && !authUser) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>Authenticating Student Hub...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

// ─── Layouts ────────────────────────────────────────────────────
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="sidebar-overlay open" onClick={() => setSidebarOpen(false)}></div>}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`} style={sidebarOpen ? {position: 'fixed', zIndex: 1000} : {}}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const StudentLayout = () => {
  const { student, authUser } = useAuth();
  const [photo, setPhoto] = React.useState(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    // ⚡ SYNC: Load photo from DB if available, otherwise hit student-specific cache
    if (student?.avatar_url) {
      setPhoto(student.avatar_url);
    } else if (student?.student_id) {
      setPhoto(localStorage.getItem(`studentPhoto_${student.student_id}`));
    } else {
      setPhoto(null);
    }
  }, [student]);

  // Use metadata as fallback if the DB row hasn't arrived yet
  const studentName = student?.full_name || authUser?.user_metadata?.full_name || 'HMS Student';
  const studentId   = student?.student_id || 'ID Pending';

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="sidebar-overlay open" onClick={() => setSidebarOpen(false)}></div>}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`} style={sidebarOpen ? {position: 'fixed', zIndex: 1000} : {}}>
          <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="main-content">
        <div className="student-top-bar" style={{
          height: 72,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Student Portal</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {photo ? (
                <img src={photo} alt="P" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                    {studentName[0]}
                </div>
                )}
                <div className="profile-text-desktop" style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>{studentName}</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{studentId}</p>
                </div>
            </div>
          </div>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// ─── App ────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/signup" element={<StudentSignup />} />

          {/* Admin Protected */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/swaps" element={<AdminSwaps />} />
            </Route>
          </Route>

          {/* Student Protected */}
          <Route element={<StudentPrivateRoute />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/room" element={<MyRoom />} />
              <Route path="/student/fees" element={<PayFees />} />
              <Route path="/student/mess" element={<MessMenu />} />
              <Route path="/student/complaint" element={<RaiseComplaint />} />
              <Route path="/student/notices" element={<Notices />} />
              <Route path="/student/profile" element={<MyProfile />} />
              <Route path="/student/exchange" element={<RoomExchange />} />
            </Route>
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Complaints from './pages/Complaints';
import Payments from './pages/Payments';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Student pages
import StudentSidebar from './components/StudentSidebar';
import StudentDashboard from './pages/student/StudentDashboard';
import MyRoom from './pages/student/MyRoom';
import PayFees from './pages/student/PayFees';
import MessMenu from './pages/student/MessMenu';
import RaiseComplaint from './pages/student/RaiseComplaint';
import Notices from './pages/student/Notices';
import MyProfile from './pages/student/MyProfile';

// ─── Route Guards ────────────────────────────────────────────────
const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const StudentPrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('isStudentAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// ─── Layouts ────────────────────────────────────────────────────
const AdminLayout = () => (
  <div className="admin-layout">
    <Sidebar />
    <div className="main-content">
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  </div>
);

const StudentLayout = () => {
  const [photo, setPhoto] = React.useState(() => localStorage.getItem('studentPhoto') || null);

  React.useEffect(() => {
    const sync = () => setPhoto(localStorage.getItem('studentPhoto') || null);
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return (
    <div className="admin-layout">
      <StudentSidebar />
      <div className="main-content">
        <div style={{
          height: 72,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Student Portal</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {photo ? (
              <img src={photo} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EEF2FF' }} />
            ) : (
              <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 700 }}>M</div>
            )}
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Mohammed Fayaz VP</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Student · Room 100</p>
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
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/payments" element={<Payments />} />
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
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

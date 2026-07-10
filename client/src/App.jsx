import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import AddEntryModals from "./components/AddEntryModals/AddEntryModals";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Reports from "./pages/Reports/Reports";
import Analytics from "./pages/Analytics/Analytics";
import AIAdvisor from "./pages/AIAdvisor/AIAdvisor";
import BudgetPlanner from "./pages/BudgetPlanner/BudgetPlanner";
import NotificationsPage from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";

function ProtectedShell({ children }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (loading) return <div className="auth-shell">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="app-content">{children}</div>
        <Footer />
      </div>
      <AddEntryModals />
    </div>
  );
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-shell">Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />

      <Route path="/dashboard" element={<ProtectedShell><Dashboard /></ProtectedShell>} />
      <Route path="/reports" element={<ProtectedShell><Reports /></ProtectedShell>} />
      <Route path="/analytics" element={<ProtectedShell><Analytics /></ProtectedShell>} />
      <Route path="/ai-advisor" element={<ProtectedShell><AIAdvisor /></ProtectedShell>} />
      <Route path="/budget-planner" element={<ProtectedShell><BudgetPlanner /></ProtectedShell>} />
      <Route path="/notifications" element={<ProtectedShell><NotificationsPage /></ProtectedShell>} />
      <Route path="/settings" element={<ProtectedShell><Settings /></ProtectedShell>} />
      <Route path="/profile" element={<ProtectedShell><Profile /></ProtectedShell>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

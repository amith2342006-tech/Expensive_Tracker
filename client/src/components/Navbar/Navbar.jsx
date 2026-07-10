import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../Notifications/NotificationBell";
import "./Navbar.css";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <button className="navbar-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
        <Menu size={20} />
      </button>
      <div className="navbar-spacer" />
      <NotificationBell />
      <button className="navbar-profile" onClick={() => navigate("/profile")}>
        <span className="navbar-avatar">
          {(user?.displayName || user?.email || "U")[0].toUpperCase()}
        </span>
        <span className="navbar-name">{user?.displayName || user?.email}</span>
      </button>
      <button className="btn btn-ghost" onClick={logout}>Log out</button>
    </header>
  );
}

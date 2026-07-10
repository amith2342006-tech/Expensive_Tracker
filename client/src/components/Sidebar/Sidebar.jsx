import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MinusCircle,
  PlusCircle,
  BarChart2,
  FileBarChart,
  Sparkles,
  PiggyBank,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";
import { useModal } from "../../context/ModalContext";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", Icon: BarChart2 },
  { to: "/reports", label: "Reports", Icon: FileBarChart },
  { to: "/ai-advisor", label: "AI Advisor", Icon: Sparkles },
  { to: "/budget-planner", label: "Budget Planner", Icon: PiggyBank },
  { to: "/notifications", label: "Notifications", Icon: Bell },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
];

export default function Sidebar({ open, onNavigate }) {
  const { openAddExpense, openAddIncome } = useModal();

  return (
    <aside className={"sidebar scrollbar-thin" + (open ? " open" : "")}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">EC</span>
        <div>
          <div className="sidebar-brand-name">Expense Calculator</div>
          <div className="sidebar-brand-sub text-muted">Pro</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
          Dashboard
        </NavLink>

        <button
          type="button"
          className="sidebar-link sidebar-link-button"
          onClick={() => { openAddExpense(); onNavigate?.(); }}
        >
          <span className="sidebar-icon"><MinusCircle size={18} /></span>
          Add Expense
        </button>

        <button
          type="button"
          className="sidebar-link sidebar-link-button"
          onClick={() => { openAddIncome(); onNavigate?.(); }}
        >
          <span className="sidebar-icon"><PlusCircle size={18} /></span>
          Add Income
        </button>

        <div className="sidebar-divider" />

        {NAV.filter((item) => item.to !== "/dashboard").map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <span className="sidebar-icon"><Icon size={18} /></span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

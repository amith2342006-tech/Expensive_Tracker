import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { subscribeNotifications, markAllRead } from "../../services/notificationService";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => subscribeNotifications(setItems), []);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="bell-wrap" ref={ref}>
      <button
        className="bell-btn"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unread > 0 && <span className="bell-dot">{unread}</span>}
      </button>
      {open && (
        <div className="bell-dropdown panel scrollbar-thin">
          <div className="bell-dropdown-title">Notifications</div>
          {items.length === 0 && <div className="bell-empty text-muted">Nothing yet — you're all caught up.</div>}
          {items.slice(0, 8).map((n) => (
            <div key={n.id} className={"bell-item bell-" + n.severity}>
              <div className="bell-item-title">{n.title}</div>
              <div className="bell-item-msg text-secondary">{n.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

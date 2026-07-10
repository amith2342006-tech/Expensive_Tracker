import { useEffect, useState } from "react";
import {
  subscribeNotifications,
  clearNotifications,
  requestBrowserPermission,
} from "../../services/notificationService";
import { formatDate } from "../../utils/helpers";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  useEffect(() => subscribeNotifications(setItems), []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Stay informed</div>
          <h1>Notifications</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {permission !== "granted" && permission !== "unsupported" && (
            <button className="btn" onClick={() => requestBrowserPermission().then(setPermission)}>
              Enable browser alerts
            </button>
          )}
          <button className="btn btn-ghost" onClick={clearNotifications}>Clear all</button>
        </div>
      </div>

      <div className="panel">
        {items.length === 0 && (
          <div className="text-muted" style={{ padding: 30, textAlign: "center" }}>
            No notifications yet. Budget alerts and recurring-expense reminders will show up here.
          </div>
        )}
        {items.map((n) => (
          <div key={n.id} className="list-row" style={{ alignItems: "flex-start" }}>
            <div>
              <span className={"badge badge-" + (n.severity === "danger" ? "expense" : n.severity === "positive" ? "income" : "gold")} style={{ marginBottom: 6 }}>
                {n.type}
              </span>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 6 }}>{n.title}</div>
              <div className="text-secondary" style={{ fontSize: 13, marginTop: 2 }}>{n.message}</div>
            </div>
            <span className="text-muted" style={{ fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(n.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

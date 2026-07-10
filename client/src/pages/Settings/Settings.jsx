import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { scheduleWeeklyReports } from "../../services/emailService";
import { requestBrowserPermission } from "../../services/notificationService";

export default function Settings() {
  const { user, isFirebaseConfigured } = useAuth();
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [status, setStatus] = useState("");

  async function toggleWeekly(checked) {
    setWeeklyReports(checked);
    try {
      await scheduleWeeklyReports({ uid: user.uid, email: user.email, enabled: checked });
      setStatus(checked ? "Weekly email reports enabled." : "Weekly email reports disabled.");
    } catch {
      setStatus("Couldn't reach the server to update your schedule — is it running?");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Preferences</div>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="panel card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>Account</h3>
        <div className="text-secondary" style={{ fontSize: 13, marginBottom: 6 }}>Signed in as {user?.email}</div>
        <div className="badge" style={{ background: isFirebaseConfigured ? "var(--income-dim)" : "var(--budget-gold-dim)", color: isFirebaseConfigured ? "var(--income)" : "var(--budget-gold)" }}>
          {isFirebaseConfigured ? "Cloud account (Firebase)" : "Local demo account"}
        </div>
      </div>

      <div className="panel card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>Notifications</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <input type="checkbox" style={{ width: "auto" }} checked={weeklyReports} onChange={(e) => toggleWeekly(e.target.checked)} id="weekly" />
          <label htmlFor="weekly" style={{ margin: 0 }}>Send me a weekly email report</label>
        </div>
        <button className="btn" onClick={() => requestBrowserPermission()}>Enable browser notifications</button>
        {status && <div className="text-secondary" style={{ fontSize: 13, marginTop: 12 }}>{status}</div>}
      </div>

      <div className="panel card-pad">
        <h3 style={{ marginBottom: 10, fontSize: 16 }}>About this app</h3>
        <p className="text-secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
          Expense Calculator Pro tracks income and expenses, warns you before you go over budget,
          reminds you about recurring bills, and gives you rule-based spending insights — all
          scoped privately to your account.
        </p>
      </div>
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function sendReportEmail({ toEmail, name, expenses, income, month }) {
  const res = await fetch(`${API_BASE}/api/reports/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toEmail, name, expenses, income, month }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send report email.");
  }
  return res.json();
}

export async function scheduleWeeklyReports({ uid, email, enabled }) {
  const res = await fetch(`${API_BASE}/api/reports/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, email, enabled }),
  });
  if (!res.ok) throw new Error("Failed to update report schedule.");
  return res.json();
}

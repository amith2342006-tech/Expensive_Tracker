import { useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useAuth } from "../../context/AuthContext";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import { CATEGORIES, exportToCSV, formatCurrency } from "../../utils/helpers";
import { sendReportEmail } from "../../services/emailService";

export default function Reports() {
  const { expenses, income, removeExpense } = useExpenses();
  const { user } = useAuth();
  const [category, setCategory] = useState("All");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => category === "All" || e.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, category]);

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  function handleExport() {
    exportToCSV(filtered.map((e) => ({
      title: e.title, amount: e.amount, category: e.category, date: e.date, recurring: !!e.recurring,
    })), "expense-report.csv");
  }

  async function handleEmailReport() {
    setSending(true);
    setStatus("");
    try {
      await sendReportEmail({
        toEmail: user.email,
        name: user.displayName || user.email,
        expenses: filtered,
        income,
        month: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      });
      setStatus("Report sent — check your inbox in a minute.");
    } catch (err) {
      setStatus("Couldn't send email: " + err.message + " (Is the server running with SMTP configured?)");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Records</div>
          <h1>Reports</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={handleExport}>Export CSV</button>
          <button className="btn btn-primary" onClick={handleEmailReport} disabled={sending}>
            {sending ? "Sending…" : "Email me this report"}
          </button>
        </div>
      </div>

      {status && <div className="panel card-pad text-secondary" style={{ marginBottom: 20, fontSize: 13 }}>{status}</div>}

      <div className="panel card-pad" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 240 }}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <div className="text-secondary">Total: <span className="text-expense mono" style={{ fontWeight: 700 }}>{formatCurrency(total)}</span></div>
      </div>

      <div className="panel">
        {filtered.length === 0 && (
          <div className="text-muted" style={{ padding: 30, textAlign: "center" }}>No expenses match this filter.</div>
        )}
        {filtered.map((e) => (
          <ExpenseCard key={e.id} expense={e} onEdit={() => {}} onDelete={removeExpense} />
        ))}
      </div>
    </div>
  );
}

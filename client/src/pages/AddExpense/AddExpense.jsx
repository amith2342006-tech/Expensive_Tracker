import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { CATEGORIES } from "../../utils/helpers";

const today = () => new Date().toISOString().slice(0, 10);

function addInterval(dateStr, freq) {
  const d = new Date(dateStr);
  if (freq === "weekly") d.setDate(d.getDate() + 7);
  else if (freq === "monthly") d.setMonth(d.getMonth() + 1);
  else if (freq === "yearly") d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export default function AddExpense({ onDone }) {
  const { addExpense } = useExpenses();
  const [form, setForm] = useState({
    title: "", amount: "", category: CATEGORIES[0].name, date: today(),
    notes: "", recurring: false, frequency: "monthly",
  });
  const [saving, setSaving] = useState(false);

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        notes: form.notes,
        recurring: form.recurring,
        frequency: form.recurring ? form.frequency : null,
        nextDueDate: form.recurring ? addInterval(form.date, form.frequency) : null,
      };
      await addExpense(payload);
      onDone?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Title</label>
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Grocery run" />
      </div>
      <div className="grid grid-2">
        <div className="field">
          <label>Amount (₹)</label>
          <input type="number" min="0" step="0.01" required value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0.00" />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Category</label>
        <select value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Notes (optional)</label>
        <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any details worth remembering" />
      </div>

      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <input type="checkbox" style={{ width: "auto" }} checked={form.recurring} onChange={(e) => set("recurring", e.target.checked)} id="recurring" />
        <label htmlFor="recurring" style={{ margin: 0 }}>This is a recurring expense</label>
      </div>

      {form.recurring && (
        <div className="field">
          <label>Repeats</label>
          <select value={form.frequency} onChange={(e) => set("frequency", e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>
            You'll get a reminder notification 3 days before each due date.
          </div>
        </div>
      )}

      <button className="btn btn-danger" style={{ width: "100%" }} disabled={saving}>
        {saving ? "Saving…" : "Save expense"}
      </button>
    </form>
  );
}

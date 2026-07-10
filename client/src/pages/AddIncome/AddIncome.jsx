import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { INCOME_SOURCES } from "../../utils/helpers";

const today = () => new Date().toISOString().slice(0, 10);

export default function AddIncome({ onDone }) {
  const { addIncome } = useExpenses();
  const [form, setForm] = useState({ source: INCOME_SOURCES[0], amount: "", date: today(), note: "" });
  const [saving, setSaving] = useState(false);

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await addIncome({ ...form, amount: Number(form.amount) });
      onDone?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Source</label>
        <select value={form.source} onChange={(e) => set("source", e.target.value)}>
          {INCOME_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
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
        <label>Note (optional)</label>
        <textarea rows={3} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Any details worth remembering" />
      </div>
      <button className="btn btn-primary" style={{ width: "100%" }} disabled={saving}>
        {saving ? "Saving…" : "Save income"}
      </button>
    </form>
  );
}

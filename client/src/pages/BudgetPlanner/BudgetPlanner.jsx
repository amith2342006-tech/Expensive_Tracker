import { useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import BudgetCard from "../../components/BudgetCard/BudgetCard";
import { CATEGORIES, isSameMonth } from "../../utils/helpers";

export default function BudgetPlanner() {
  const { budgets, expenses, addBudget, updateBudget, removeBudget } = useExpenses();
  const [form, setForm] = useState({ category: CATEGORIES[0].name, limit: "" });
  const [editingId, setEditingId] = useState(null);

  const spentByCategory = useMemo(() => {
    const map = {};
    expenses.filter((e) => isSameMonth(e.date)).forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return map;
  }, [expenses]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { category: form.category, limit: Number(form.limit) };
    if (editingId) {
      await updateBudget(editingId, payload);
      setEditingId(null);
    } else {
      await addBudget(payload);
    }
    setForm({ category: CATEGORIES[0].name, limit: "" });
  }

  function handleEdit(b) {
    setEditingId(b.id);
    setForm({ category: b.category, limit: b.limit });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Planning</div>
          <h1>Budget Planner</h1>
        </div>
      </div>

      <form className="panel card-pad" style={{ marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }} onSubmit={handleSubmit}>
        <div className="field" style={{ marginBottom: 0, minWidth: 200 }}>
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
          <label>Monthly limit (₹)</label>
          <input type="number" min="0" required value={form.limit} onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))} />
        </div>
        <button className="btn btn-primary">{editingId ? "Update budget" : "Add budget"}</button>
        {editingId && (
          <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setForm({ category: CATEGORIES[0].name, limit: "" }); }}>
            Cancel
          </button>
        )}
      </form>

      <div className="grid grid-3">
        {budgets.map((b) => (
          <BudgetCard key={b.id} budget={b} spent={spentByCategory[b.category] || 0} onEdit={handleEdit} onDelete={removeBudget} />
        ))}
      </div>
      {budgets.length === 0 && (
        <div className="panel card-pad text-muted" style={{ textAlign: "center" }}>
          No budgets yet. Set one above — you'll get a warning notification at 80% and an alert at 100%.
        </div>
      )}
    </div>
  );
}

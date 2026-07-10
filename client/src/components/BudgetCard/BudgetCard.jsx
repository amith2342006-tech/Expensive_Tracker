import { formatCurrency } from "../../utils/helpers";
import "./BudgetCard.css";

export default function BudgetCard({ budget, spent, onEdit, onDelete }) {
  const pct = budget.limit > 0 ? Math.min(100, (spent / budget.limit) * 100) : 0;
  const over = spent > budget.limit;
  return (
    <div className="panel card-pad budget-card">
      <div className="budget-card-top">
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{budget.category}</div>
          <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>Monthly limit {formatCurrency(budget.limit)}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => onEdit(budget)}>Edit</button>
          <button className="btn btn-ghost" onClick={() => onDelete(budget.id)}>Delete</button>
        </div>
      </div>
      <div className="budget-bar-track">
        <div
          className="budget-bar-fill"
          style={{ width: pct + "%", background: over ? "var(--expense)" : pct > 80 ? "var(--budget-gold)" : "var(--income)" }}
        />
      </div>
      <div className="budget-card-bottom text-secondary">
        <span className={over ? "text-expense" : ""}>{formatCurrency(spent)} spent</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

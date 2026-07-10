import { formatCurrency, formatDate, categoryColor } from "../../utils/helpers";
import "./ExpenseCard.css";

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <div className="expense-row list-row">
      <div className="expense-row-main">
        <span className="expense-dot" style={{ background: categoryColor(expense.category) }} />
        <div>
          <div className="expense-title">{expense.title}</div>
          <div className="text-muted expense-meta">
            {expense.category} · {formatDate(expense.date)}
            {expense.recurring && <span className="badge badge-gold" style={{ marginLeft: 8 }}>Recurring</span>}
          </div>
        </div>
      </div>
      <div className="expense-row-right">
        <span className="text-expense expense-amount">− {formatCurrency(expense.amount)}</span>
        <button className="btn btn-ghost" onClick={() => onEdit(expense)}>Edit</button>
        <button className="btn btn-ghost" onClick={() => onDelete(expense.id)}>Delete</button>
      </div>
    </div>
  );
}

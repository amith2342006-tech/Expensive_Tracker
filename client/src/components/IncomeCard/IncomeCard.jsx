import { formatCurrency, formatDate } from "../../utils/helpers";

export default function IncomeCard({ item, onEdit, onDelete }) {
  return (
    <div className="list-row">
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{item.source}</div>
        <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>
          {item.note || "No note"} · {formatDate(item.date)}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="text-income" style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
          + {formatCurrency(item.amount)}
        </span>
        <button className="btn btn-ghost" onClick={() => onEdit(item)}>Edit</button>
        <button className="btn btn-ghost" onClick={() => onDelete(item.id)}>Delete</button>
      </div>
    </div>
  );
}

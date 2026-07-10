import { useMemo } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import LineChartComp from "../../components/Charts/LineChartComp";
import BarChartComp from "../../components/Charts/BarChartComp";
import PieChartComp from "../../components/Charts/PieChartComp";
import { categoryColor, formatCurrency } from "../../utils/helpers";

export default function Analytics() {
  const { expenses, income } = useExpenses();

  const dailyTrend = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const amount = expenses.filter((e) => e.date === key).reduce((s, e) => s + Number(e.amount), 0);
      days.push({ label, amount });
    }
    return days;
  }, [expenses]);

  const yearMonths = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const ref = new Date();
      ref.setMonth(ref.getMonth() - i);
      const label = ref.toLocaleDateString("en-IN", { month: "short" });
      const inc = income.filter((it) => {
        const d = new Date(it.date);
        return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
      }).reduce((s, it) => s + Number(it.amount), 0);
      const exp = expenses.filter((it) => {
        const d = new Date(it.date);
        return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
      }).reduce((s, it) => s + Number(it.amount), 0);
      months.push({ name: label, income: inc, expense: exp });
    }
    return months;
  }, [expenses, income]);

  const categoryTotals = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: categoryColor(name) }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Deep dive</div>
          <h1>Analytics</h1>
        </div>
      </div>

      <div className="panel card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>Daily spending — last 30 days</h3>
        <LineChartComp data={dailyTrend} dataKey="amount" color="#FB7373" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="panel card-pad">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Yearly income vs expenses</h3>
          <BarChartComp data={yearMonths} height={300} />
        </div>
        <div className="panel card-pad">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>All-time category split</h3>
          <PieChartComp data={categoryTotals} height={300} />
        </div>
      </div>

      <div className="panel">
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-hair)" }}>
          <h3 style={{ fontSize: 16 }}>Category ranking</h3>
        </div>
        {categoryTotals.map((c, i) => (
          <div key={c.name} className="list-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="text-muted mono" style={{ width: 20 }}>{i + 1}</span>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, display: "inline-block" }} />
              {c.name}
            </div>
            <span className="mono">{formatCurrency(c.value)}</span>
          </div>
        ))}
        {categoryTotals.length === 0 && <div className="text-muted" style={{ padding: 30, textAlign: "center" }}>No data yet.</div>}
      </div>
    </div>
  );
}

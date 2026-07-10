import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, MinusCircle, Wallet, Sparkles } from "lucide-react";
import { useExpenses } from "../../context/ExpenseContext";
import { useModal } from "../../context/ModalContext";
import StatsCard from "../../components/Dashboard/StatsCard";
import PieChartComp from "../../components/Charts/PieChartComp";
import BarChartComp from "../../components/Charts/BarChartComp";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import { formatCurrency, isSameMonth, categoryColor } from "../../utils/helpers";

export default function Dashboard() {
  const { expenses, income, removeExpense } = useExpenses();
  const { openAddExpense, openAddIncome } = useModal();

  const thisMonthExpenses = useMemo(() => expenses.filter((e) => isSameMonth(e.date)), [expenses]);
  const thisMonthIncome = useMemo(() => income.filter((i) => isSameMonth(i.date)), [income]);

  const totalExpense = thisMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = thisMonthIncome.reduce((s, e) => s + Number(e.amount), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const pieData = useMemo(() => {
    const map = {};
    thisMonthExpenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: categoryColor(name) }));
  }, [thisMonthExpenses]);

  const last6MonthsData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const ref = new Date();
      ref.setMonth(ref.getMonth() - i);
      const label = ref.toLocaleDateString("en-IN", { month: "short" });
      const inc = income.filter((it) => isSameMonth(it.date, ref)).reduce((s, it) => s + Number(it.amount), 0);
      const exp = expenses.filter((it) => isSameMonth(it.date, ref)).reduce((s, it) => s + Number(it.amount), 0);
      months.push({ name: label, income: inc, expense: exp });
    }
    return months;
  }, [expenses, income]);

  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Overview</div>
          <h1>This month at a glance</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={openAddIncome}>
            <PlusCircle size={16} /> Income
          </button>
          <button className="btn btn-primary" onClick={openAddExpense}>
            <MinusCircle size={16} /> Expense
          </button>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatsCard icon={<PlusCircle size={18} />} label="Income" value={formatCurrency(totalIncome)} tone="income" sub={`${thisMonthIncome.length} entries this month`} />
        <StatsCard icon={<MinusCircle size={18} />} label="Expenses" value={formatCurrency(totalExpense)} tone="expense" sub={`${thisMonthExpenses.length} entries this month`} />
        <StatsCard icon={<Wallet size={18} />} label="Balance" value={formatCurrency(balance)} tone={balance >= 0 ? "income" : "expense"} sub={balance >= 0 ? "You're in the green" : "Spending exceeds income"} />
        <StatsCard icon={<Sparkles size={18} />} label="Savings rate" value={`${savingsRate.toFixed(0)}%`} tone="gold" sub="of income kept this month" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24, alignItems: "stretch" }}>
        <div className="panel card-pad">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Spending by category</h3>
          <PieChartComp data={pieData} />
        </div>
        <div className="panel card-pad">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Income vs expenses — last 6 months</h3>
          <BarChartComp data={last6MonthsData} />
        </div>
      </div>

      <div className="panel">
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-hair)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16 }}>Recent expenses</h3>
          <Link to="/reports" className="text-secondary" style={{ fontSize: 13 }}>View all →</Link>
        </div>
        {recent.length === 0 && (
          <div className="text-muted" style={{ padding: 30, textAlign: "center" }}>No expenses logged yet. Add your first one.</div>
        )}
        {recent.map((e) => (
          <ExpenseCard key={e.id} expense={e} onEdit={() => {}} onDelete={removeExpense} />
        ))}
      </div>
    </div>
  );
}

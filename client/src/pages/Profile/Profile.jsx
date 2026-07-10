import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExpenses } from "../../context/ExpenseContext";
import ProfileCard from "../../components/Profile/ProfileCard";
import { formatCurrency } from "../../utils/helpers";

export default function Profile() {
  const { user } = useAuth();
  const { expenses, income, budgets } = useExpenses();

  const totalExpense = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses]);
  const totalIncome = useMemo(() => income.reduce((s, e) => s + Number(e.amount), 0), [income]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">You</div>
          <h1>Profile</h1>
        </div>
      </div>

      <ProfileCard user={user} />

      <div className="grid grid-4" style={{ marginTop: 20 }}>
        <div className="panel card-pad">
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Lifetime income</div>
          <div className="text-income" style={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(totalIncome)}</div>
        </div>
        <div className="panel card-pad">
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Lifetime expenses</div>
          <div className="text-expense" style={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(totalExpense)}</div>
        </div>
        <div className="panel card-pad">
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Transactions logged</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{expenses.length + income.length}</div>
        </div>
        <div className="panel card-pad">
          <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Budgets tracked</div>
          <div className="text-gold" style={{ fontSize: 20, fontWeight: 700 }}>{budgets.length}</div>
        </div>
      </div>
    </div>
  );
}

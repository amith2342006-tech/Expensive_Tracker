import { isSameMonth, formatCurrency } from "../utils/helpers";

// ---------- Rule-based engine (works fully offline, no API key needed) ----------
function monthTotal(items, monthOffset = 0) {
  const ref = new Date();
  ref.setMonth(ref.getMonth() - monthOffset);
  return items
    .filter((e) => isSameMonth(e.date, ref))
    .reduce((sum, e) => sum + Number(e.amount), 0);
}

function categoryBreakdown(expenses, monthOffset = 0) {
  const ref = new Date();
  ref.setMonth(ref.getMonth() - monthOffset);
  const map = {};
  expenses
    .filter((e) => isSameMonth(e.date, ref))
    .forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
  return map;
}

export function generateInsights(expenses, income, budgets) {
  const insights = [];

  const thisMonth = monthTotal(expenses, 0);
  const lastMonth = monthTotal(expenses, 1);
  const thisIncome = monthTotal(income, 0);

  // Spending trend
  if (lastMonth > 0) {
    const change = ((thisMonth - lastMonth) / lastMonth) * 100;
    if (change > 15) {
      insights.push({
        icon: "trending-up",
        title: "Spending is climbing",
        detail: `You've spent ${change.toFixed(0)}% more this month than last month (${formatCurrency(thisMonth)} vs ${formatCurrency(lastMonth)}). Worth a closer look at what changed.`,
        severity: "warning",
      });
    } else if (change < -15) {
      insights.push({
        icon: "trending-down",
        title: "Nice, spending is down",
        detail: `You've spent ${Math.abs(change).toFixed(0)}% less this month than last month. Keep it up.`,
        severity: "positive",
      });
    }
  }

  // Savings rate
  if (thisIncome > 0) {
    const savingsRate = ((thisIncome - thisMonth) / thisIncome) * 100;
    if (savingsRate < 10) {
      insights.push({
        icon: "alert-triangle",
        title: "Low savings rate",
        detail: `You're saving only ${savingsRate.toFixed(0)}% of your income this month. Financial guidance generally suggests aiming for at least 20%.`,
        severity: "danger",
      });
    } else if (savingsRate > 30) {
      insights.push({
        icon: "trophy",
        title: "Strong savings rate",
        detail: `You're saving ${savingsRate.toFixed(0)}% of your income this month — well above the typical 20% guideline.`,
        severity: "positive",
      });
    }
  }

  // Category concentration
  const breakdown = categoryBreakdown(expenses, 0);
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const topCategory = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];
  if (topCategory && total > 0) {
    const share = (topCategory[1] / total) * 100;
    if (share > 40) {
      insights.push({
        icon: "target",
        title: `${topCategory[0]} dominates your spending`,
        detail: `${share.toFixed(0)}% of this month's expenses (${formatCurrency(topCategory[1])}) went to ${topCategory[0]}. Consider setting a dedicated budget for it.`,
        severity: "info",
      });
    }
  }

  // Budget overruns
  budgets.forEach((b) => {
    const spent = breakdown[b.category] || 0;
    if (b.limit > 0 && spent > b.limit) {
      insights.push({
        icon: "alert-octagon",
        title: `Over budget on ${b.category}`,
        detail: `You've spent ${formatCurrency(spent)} against a ${formatCurrency(b.limit)} budget — ${formatCurrency(spent - b.limit)} over.`,
        severity: "danger",
      });
    }
  });

  // Recurring cost awareness
  const recurringTotal = expenses
    .filter((e) => e.recurring)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  if (recurringTotal > 0 && thisIncome > 0) {
    const recurringShare = (recurringTotal / thisIncome) * 100;
    if (recurringShare > 50) {
      insights.push({
        icon: "repeat",
        title: "Recurring costs are heavy",
        detail: `Recurring expenses make up ${recurringShare.toFixed(0)}% of your income. Review subscriptions and fixed bills for anything you can trim.`,
        severity: "warning",
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      icon: "check-circle",
      title: "You're on track",
      detail: "No unusual patterns detected in your spending this month. Keep logging expenses for sharper insights.",
      severity: "positive",
    });
  }

  return insights;
}

// ---------- Optional real-LLM upgrade ----------
// If VITE_ANTHROPIC_API_KEY is set, this calls the Anthropic API directly
// from a small proxy on your server (recommended) instead of the browser,
// so the key is never exposed client-side. See server/routes/aiRoutes.js.
export async function generateAISummary(expenses, income, budgets, apiBaseUrl) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/ai/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenses, income, budgets }),
    });
    if (!res.ok) throw new Error("AI service unavailable");
    const data = await res.json();
    return data.summary;
  } catch {
    // Falls back silently to the rule-based insights shown in the UI.
    return null;
  }
}

// Thin wrapper around the Anthropic API for the optional "real AI" upgrade
// to the AI Advisor page. Falls back gracefully if no key is set — the
// client already has a solid rule-based engine, so this is purely additive.

export async function getAISpendingSummary({ expenses, income, budgets }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = income.reduce((s, e) => s + Number(e.amount), 0);
  const byCategory = {};
  expenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount); });

  const prompt = `You are a personal finance assistant. Based on this user's data, write a short (3-4 sentence),
friendly, specific spending summary and one concrete suggestion. Do not use markdown.

Total income: ₹${totalIncome}
Total expenses: ₹${totalExpense}
Spending by category: ${JSON.stringify(byCategory)}
Budgets: ${JSON.stringify(budgets.map((b) => ({ category: b.category, limit: b.limit })))}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }
  const data = await response.json();
  const text = data.content?.find((b) => b.type === "text")?.text;
  return text || null;
}

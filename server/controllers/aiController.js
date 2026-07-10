import { getAISpendingSummary } from "../services/aiService.js";

export async function aiSummary(req, res) {
  const { expenses = [], income = [], budgets = [] } = req.body;
  try {
    const summary = await getAISpendingSummary({ expenses, income, budgets });
    if (!summary) return res.status(404).json({ message: "AI not configured on server." });
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

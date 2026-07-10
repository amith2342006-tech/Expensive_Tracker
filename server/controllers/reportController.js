import { sendReportEmail } from "../services/emailService.js";
import { setWeeklySchedule } from "../services/cronService.js";

export async function emailReport(req, res) {
  const { toEmail, name, expenses = [], income = [], month } = req.body;
  if (!toEmail) return res.status(400).json({ message: "toEmail is required." });

  try {
    await sendReportEmail({ toEmail, name: name || toEmail, month: month || "your recent activity", expenses, income });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export function updateSchedule(req, res) {
  const { uid, email, enabled } = req.body;
  if (!uid || !email) return res.status(400).json({ message: "uid and email are required." });
  setWeeklySchedule(uid, email, Boolean(enabled));
  res.json({ success: true });
}

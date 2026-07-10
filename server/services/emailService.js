import nodemailer from "nodemailer";

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildReportHTML({ name, month, expenses, income }) {
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = income.reduce((s, e) => s + Number(e.amount), 0);

  const byCategory = {};
  expenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount); });

  const categoryRows = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `<tr><td style="padding:6px 0;">${cat}</td><td style="padding:6px 0;text-align:right;">₹${amt.toFixed(2)}</td></tr>`)
    .join("");

  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="margin-bottom: 4px;">Your ${month} report</h2>
    <p style="color:#555;">Hi ${name}, here's a summary of your finances.</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <tr><td style="padding:8px 0; font-weight:bold;">Total income</td><td style="padding:8px 0; text-align:right; color:#0a8a4f;">₹${totalIncome.toFixed(2)}</td></tr>
      <tr><td style="padding:8px 0; font-weight:bold;">Total expenses</td><td style="padding:8px 0; text-align:right; color:#c0392b;">₹${totalExpense.toFixed(2)}</td></tr>
      <tr><td style="padding:8px 0; font-weight:bold;">Balance</td><td style="padding:8px 0; text-align:right;">₹${(totalIncome - totalExpense).toFixed(2)}</td></tr>
    </table>
    <h3>Spending by category</h3>
    <table style="width:100%; border-collapse:collapse;">${categoryRows || "<tr><td>No expenses recorded.</td></tr>"}</table>
    <p style="margin-top:24px; font-size:12px; color:#888;">Sent by Expense Calculator Pro.</p>
  </div>`;
}

export async function sendReportEmail({ toEmail, name, month, expenses, income }) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP is not configured on the server. Fill in server/.env with SMTP_USER and SMTP_PASS.");
  }
  const html = buildReportHTML({ name, month, expenses, income });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: `Your ${month} expense report`,
    html,
  });
}

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

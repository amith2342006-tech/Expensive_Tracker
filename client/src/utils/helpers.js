export const CATEGORIES = [
  { name: "Food & Dining", color: "#FB7373" },
  { name: "Transport", color: "#5B8DEF" },
  { name: "Shopping", color: "#F2C265" },
  { name: "Bills & Utilities", color: "#B279E0" },
  { name: "Entertainment", color: "#34D399" },
  { name: "Health", color: "#4DD0E1" },
  { name: "Rent/Housing", color: "#EF9A6C" },
  { name: "Education", color: "#8CD867" },
  { name: "Travel", color: "#F27CB0" },
  { name: "Other", color: "#94A3B8" },
];

export const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

export function formatCurrency(amount, currency = "INR") {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value.toFixed(0)}`;
  }
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function categoryColor(name) {
  return CATEGORIES.find((c) => c.name === name)?.color || "#94A3B8";
}

export function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function isSameMonth(dateStr, ref = new Date()) {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function exportToCSV(rows, filename = "export.csv") {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

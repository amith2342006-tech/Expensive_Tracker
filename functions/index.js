// Serverless (Firebase Cloud Functions) versions of the two background jobs
// that keep Budget Alerts and Recurring Expense Reminders working even when
// the Express server (server/) is not deployed or running.
//
// Deploy with:
//   cd functions && npm install
//   firebase deploy --only functions

import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// Runs every day at 07:00 server time.
// Finds recurring expenses due within the next 3 days and writes a
// notification document each affected user's client can subscribe to.
export const recurringExpenseReminders = onSchedule("every day 07:00", async () => {
  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const snap = await db
    .collection("expenses")
    .where("recurring", "==", true)
    .get();

  const batch = db.batch();
  snap.forEach((doc) => {
    const data = doc.data();
    if (!data.nextDueDate) return;
    const due = new Date(data.nextDueDate);
    if (due >= now && due <= in3Days) {
      const notifRef = db.collection("notifications").doc();
      batch.set(notifRef, {
        uid: data.uid,
        type: "recurring",
        title: `Upcoming recurring expense: ${data.title}`,
        message: `Due ${due.toDateString()} - amount ₹${data.amount}`,
        severity: "info",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  });
  await batch.commit();
});

// Runs every day at 08:00 server time.
// Checks each user's budgets against this month's spend and writes a
// budget-alert notification at the 80% and 100% thresholds.
export const checkBudgetAlerts = onSchedule("every day 08:00", async () => {
  const budgetsSnap = await db.collection("budgets").get();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const batch = db.batch();

  for (const budgetDoc of budgetsSnap.docs) {
    const budget = budgetDoc.data();
    const expensesSnap = await db
      .collection("expenses")
      .where("uid", "==", budget.uid)
      .where("category", "==", budget.category)
      .where("date", ">=", monthStart)
      .get();

    const spent = expensesSnap.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
    const pct = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

    if (pct >= 80) {
      const notifRef = db.collection("notifications").doc();
      batch.set(notifRef, {
        uid: budget.uid,
        type: "budget",
        title: pct >= 100 ? `Budget exceeded: ${budget.category}` : `Budget warning: ${budget.category}`,
        message: `You have spent ${pct.toFixed(0)}% of your ${budget.category} budget this month.`,
        severity: pct >= 100 ? "danger" : "warning",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  await batch.commit();
});

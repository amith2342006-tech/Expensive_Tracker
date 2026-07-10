import cron from "node-cron";
import { sendReportEmail, isEmailConfigured } from "./emailService.js";

// In-memory schedule store (swap for a real DB table in production).
// Maps uid -> { email, enabled }
const weeklySubscribers = new Map();

export function setWeeklySchedule(uid, email, enabled) {
  weeklySubscribers.set(uid, { email, enabled });
}

export function startReminderCron() {
  // Every Monday at 8am: send weekly report emails to subscribed users.
  cron.schedule("0 8 * * 1", async () => {
    if (!isEmailConfigured()) return;
    for (const [uid, sub] of weeklySubscribers.entries()) {
      if (!sub.enabled) continue;
      try {
        await sendReportEmail({
          toEmail: sub.email,
          name: sub.email,
          month: "This week",
          expenses: [],
          income: [],
        });
        console.log(`Weekly report sent to ${sub.email}`);
      } catch (err) {
        console.error(`Failed to send weekly report to ${sub.email}:`, err.message);
      }
    }
  });

  // Every day at 7am: this is where a real deployment would query Firestore
  // for expenses with `recurring: true` and `nextDueDate` within 3 days,
  // then call sendReportEmail (or a push notification service) per user.
  // The client already handles this client-side in ExpenseContext.jsx via
  // in-app notifications; this server job is the place to add *email/push*
  // reminders once you wire up the Firebase Admin SDK.
  cron.schedule("0 7 * * *", () => {
    console.log("[cron] Daily recurring-expense reminder check ran (wire up Firebase Admin SDK here).");
  });

  console.log("Reminder cron jobs scheduled.");
}

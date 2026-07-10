# Expense Calculator Pro

A full-stack, multi-user personal finance tracker with Firebase Auth, Firestore cloud storage,
budget alerts, recurring expense reminders, email reports, and rule-based AI spending analysis.

## What's inside

```
Expense-Calculator-Pro/
├── client/     React + Vite frontend (charts, dashboard, all pages)
├── server/     Express backend (email reports, recurring-reminder cron, budget alert checks)
├── functions/  Firebase Cloud Functions (serverless version of the alert/reminder jobs)
└── firestore.rules
```

## 1. Equipment / accounts you need before you start

| What | Why | Get it from |
|---|---|---|
| Node.js 18+ and npm | Run the React app and the server | https://nodejs.org |
| VS Code | Editor (you're already using it) | https://code.visualstudio.com |
| A free Firebase project | Auth + Firestore database + Cloud Functions | https://console.firebase.google.com |
| A Gmail (or any SMTP) account + App Password, OR a Resend/SendGrid API key | Sending the email reports | Google Account settings → App Passwords, or resend.com / sendgrid.com |
| (Optional) OpenAI or Anthropic API key | Upgrades the built-in rule-based AI Advisor to a real LLM | https://console.anthropic.com or https://platform.openai.com |
| Git + a GitHub account | Version control / deployment | https://github.com |
| (Optional) Android Studio or Expo/React Native | To wrap this into an actual mobile app | see "Mobile app" section below |

## 2. Firebase setup (Auth + Cloud Database)

1. Go to the Firebase console → **Add project** → name it `expense-calculator-pro`.
2. **Build → Authentication → Get started** → enable **Email/Password** (and Google if you want social login).
3. **Build → Firestore Database → Create database** → start in production mode → pick a region close to you.
4. **Project settings → General → Your apps → Web app (</> icon)** → register the app → copy the `firebaseConfig` object.
5. Paste those values into `client/.env` (see `client/.env.example`).
6. Deploy the included security rules:
   ```
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point it at the existing firestore.rules
   firebase deploy --only firestore:rules
   ```

This gives you real **multi-user support** — every document in Firestore is scoped to
`uid == request.auth.uid`, so each user only ever sees their own expenses/income/budgets
(see `firestore.rules`).

## 3. Install & run

```bash
cd Expense-Calculator-Pro
npm run install:all
npm run dev
```

- Client: http://localhost:5173
- Server (email + cron API): http://localhost:5000

The client works **standalone with demo/local data** even before you wire up Firebase — it
falls back to `localStorage` so you can try the UI immediately. Once you drop your Firebase
keys into `client/.env`, it automatically switches to real cloud auth + Firestore.

## 4. Feature map

| Feature you asked for | Where it lives | Status |
|---|---|---|
| Firebase Authentication | `client/src/firebase/config.js`, `client/src/context/AuthContext.jsx`, `pages/Login`, `pages/Register`, `pages/ForgotPassword` | Ready — add your keys |
| Cloud Database (Firestore) | `client/src/context/ExpenseContext.jsx` (Firestore calls with localStorage fallback) | Ready — add your keys |
| Budget Alerts | `client/src/services/notificationService.js`, `BudgetCard`, `functions/index.js` (`checkBudgetAlerts`) | Working (client) + serverless job |
| Email Reports | `server/services/emailService.js`, `server/routes/reportRoutes.js` | Working — add SMTP creds |
| Multi-user Support | Firestore rules + per-uid queries everywhere in `ExpenseContext.jsx` | Working |
| AI-based Spending Analysis | `client/src/services/aiAdvisor.js` (rule-based, works offline) + optional real LLM call if you add an API key in `.env` | Working, upgradeable |
| Mobile App Version | See "Mobile app" section — the UI is fully responsive/PWA-ready; a Capacitor wrapper config is included | Responsive web + PWA + wrap instructions |
| Recurring Expense Reminders | `client/src/pages/AddExpense` (recurring toggle), `server/services/cronService.js`, `functions/index.js` (`recurringExpenseReminders`) | Working |
| Pie chart / Bar chart / extra charts | `client/src/components/Charts/*` (Pie, Bar, Line, Donut trend) using Recharts | Working |
| Extra features added | Dark/light theme, Goals tracker, Calendar heatmap of spending, CSV export, Profile & Settings, in-app + browser notifications, Analytics page with category trends | Working |

## 5. Mobile app version

The frontend is a responsive PWA (installable "Add to Home Screen" on Android/iOS — see
`client/public/manifest.json`). For a true native build without rewriting anything:

```bash
cd client
npm install -D @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Expense Calculator Pro" "com.yourname.expensecalculator"
npm run build
npx cap add android   # or: npx cap add ios
npx cap sync
npx cap open android  # opens Android Studio
```

## 6. Environment variables

Copy `client/.env.example` → `client/.env` and `server/.env.example` → `server/.env`, then fill
in your own Firebase, SMTP, and (optional) AI keys. Never commit real `.env` files.

## 7. Notes

- This project ships with working demo logic everywhere (localStorage + rule-based AI) so it
  runs and looks complete the moment you `npm install && npm run dev` — no keys required to explore it.
- Swap in your real Firebase/email/AI keys whenever you're ready to go live; nothing else needs
  to change since the code already checks for them and upgrades automatically.

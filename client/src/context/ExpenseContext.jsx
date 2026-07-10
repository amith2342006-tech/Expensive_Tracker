import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";
import { useAuth } from "./AuthContext";
import { uid, isSameMonth } from "../utils/helpers";
import { pushNotification } from "../services/notificationService";

const ExpenseContext = createContext(null);
export const useExpenses = () => useContext(ExpenseContext);

// ---- localStorage helpers (demo-mode / offline fallback) ----
function storeKey(uidVal, collectionName) {
  return `ecp_${collectionName}_${uidVal}`;
}
function readLocal(uidVal, collectionName) {
  return JSON.parse(localStorage.getItem(storeKey(uidVal, collectionName)) || "[]");
}
function writeLocal(uidVal, collectionName, data) {
  localStorage.setItem(storeKey(uidVal, collectionName), JSON.stringify(data));
}

const COLLECTIONS = ["expenses", "income", "budgets"];

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [ready, setReady] = useState(false);

  const setters = { expenses: setExpenses, income: setIncome, budgets: setBudgets };

  // Load + subscribe
  useEffect(() => {
    if (!user) {
      setExpenses([]); setIncome([]); setBudgets([]);
      setReady(false);
      return;
    }

    if (isFirebaseConfigured) {
      const unsubs = COLLECTIONS.map((name) => {
        const q = query(collection(db, name), where("uid", "==", user.uid));
        return onSnapshot(q, (snap) => {
          const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setters[name](rows);
        });
      });
      setReady(true);
      return () => unsubs.forEach((u) => u());
    } else {
      COLLECTIONS.forEach((name) => setters[name](readLocal(user.uid, name)));
      setReady(true);
    }
  }, [user]);

  // Generic CRUD that works against Firestore OR localStorage transparently
  const addItem = useCallback(
    async (collectionName, data) => {
      if (!user) return;
      const payload = { ...data, uid: user.uid, createdAt: new Date().toISOString() };
      if (isFirebaseConfigured) {
        await addDoc(collection(db, collectionName), payload);
      } else {
        const current = readLocal(user.uid, collectionName);
        const withId = { id: uid(), ...payload };
        const updated = [withId, ...current];
        writeLocal(user.uid, collectionName, updated);
        setters[collectionName](updated);
      }
    },
    [user]
  );

  const updateItem = useCallback(
    async (collectionName, id, data) => {
      if (!user) return;
      if (isFirebaseConfigured) {
        await updateDoc(doc(db, collectionName, id), data);
      } else {
        const current = readLocal(user.uid, collectionName);
        const updated = current.map((it) => (it.id === id ? { ...it, ...data } : it));
        writeLocal(user.uid, collectionName, updated);
        setters[collectionName](updated);
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (collectionName, id) => {
      if (!user) return;
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, collectionName, id));
      } else {
        const current = readLocal(user.uid, collectionName);
        const updated = current.filter((it) => it.id !== id);
        writeLocal(user.uid, collectionName, updated);
        setters[collectionName](updated);
      }
    },
    [user]
  );

  // ---- Budget alert check: runs whenever expenses or budgets change ----
  useEffect(() => {
    if (!ready || !budgets.length) return;
    budgets.forEach((b) => {
      const spent = expenses
        .filter((e) => e.category === b.category && isSameMonth(e.date))
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      const alertKey = `ecp_alert_${b.id}_${new Date().getMonth()}`;
      if (pct >= 100 && !sessionStorage.getItem(alertKey + "_100")) {
        pushNotification({
          type: "budget",
          title: `Budget exceeded: ${b.category}`,
          message: `You've spent ${Math.round(pct)}% of your ${b.category} budget this month.`,
          severity: "danger",
        });
        sessionStorage.setItem(alertKey + "_100", "1");
      } else if (pct >= 80 && !sessionStorage.getItem(alertKey + "_80")) {
        pushNotification({
          type: "budget",
          title: `Budget warning: ${b.category}`,
          message: `You're at ${Math.round(pct)}% of your ${b.category} budget this month.`,
          severity: "warning",
        });
        sessionStorage.setItem(alertKey + "_80", "1");
      }
    });
  }, [expenses, budgets, ready]);

  // ---- Recurring expense reminders: checks on load for due recurring items ----
  useEffect(() => {
    if (!ready) return;
    const today = new Date();
    expenses
      .filter((e) => e.recurring && e.nextDueDate)
      .forEach((e) => {
        const due = new Date(e.nextDueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        const remindKey = `ecp_remind_${e.id}_${e.nextDueDate}`;
        if (diffDays <= 3 && diffDays >= 0 && !sessionStorage.getItem(remindKey)) {
          pushNotification({
            type: "recurring",
            title: `Upcoming recurring expense: ${e.title}`,
            message: `Due ${diffDays === 0 ? "today" : `in ${diffDays} day(s)`} — ₹${e.amount}`,
            severity: "info",
          });
          sessionStorage.setItem(remindKey, "1");
        }
      });
  }, [expenses, ready]);

  const value = {
    ready,
    expenses,
    income,
    budgets,
    addExpense: (d) => addItem("expenses", d),
    updateExpense: (id, d) => updateItem("expenses", id, d),
    removeExpense: (id) => removeItem("expenses", id),
    addIncome: (d) => addItem("income", d),
    updateIncome: (id, d) => updateItem("income", id, d),
    removeIncome: (id) => removeItem("income", id),
    addBudget: (d) => addItem("budgets", d),
    updateBudget: (id, d) => updateItem("budgets", id, d),
    removeBudget: (id) => removeItem("budgets", id),
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

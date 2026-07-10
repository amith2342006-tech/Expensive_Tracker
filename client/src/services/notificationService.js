// Lightweight pub/sub so any part of the app can push a notification
// and the Notifications bell / page picks it up instantly.
const listeners = new Set();
const STORE_KEY = "ecp_notifications";

function readAll() {
  return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
}
function writeAll(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
  listeners.forEach((cb) => cb(list));
}

export function pushNotification({ type, title, message, severity = "info" }) {
  const list = readAll();
  const item = {
    id: Date.now() + Math.random().toString(36).slice(2),
    type,
    title,
    message,
    severity,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [item, ...list].slice(0, 100);
  writeAll(updated);

  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body: message });
    } catch {
      /* ignore */
    }
  }
  return item;
}

export function getNotifications() {
  return readAll();
}

export function markAllRead() {
  const list = readAll().map((n) => ({ ...n, read: true }));
  writeAll(list);
}

export function markRead(id) {
  const list = readAll().map((n) => (n.id === id ? { ...n, read: true } : n));
  writeAll(list);
}

export function clearNotifications() {
  writeAll([]);
}

export function subscribeNotifications(callback) {
  listeners.add(callback);
  callback(readAll());
  return () => listeners.delete(callback);
}

export function requestBrowserPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.requestPermission();
  }
  return Promise.resolve("unsupported");
}

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase/config";
import { uid } from "../utils/helpers";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const LOCAL_USER_KEY = "ecp_demo_user";
const LOCAL_USERS_DB = "ecp_demo_users_db";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      return unsub;
    } else {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      setUser(stored ? JSON.parse(stored) : null);
      setLoading(false);
    }
  }, []);

  function readLocalUsers() {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || "{}");
  }
  function writeLocalUsers(db) {
    localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(db));
  }

  async function register(name, email, password) {
    if (isFirebaseConfigured) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      return cred.user;
    }
    const db = readLocalUsers();
    if (db[email]) throw new Error("An account with this email already exists.");
    db[email] = { password, name, uid: uid(), email };
    writeLocalUsers(db);
    const localUser = { uid: db[email].uid, displayName: name, email };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    return localUser;
  }

  async function login(email, password) {
    if (isFirebaseConfigured) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    }
    const db = readLocalUsers();
    const record = db[email];
    if (!record || record.password !== password) {
      throw new Error("Invalid email or password.");
    }
    const localUser = { uid: record.uid, displayName: record.name, email };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    return localUser;
  }

  async function loginWithGoogle() {
    if (!isFirebaseConfigured) {
      throw new Error("Add your Firebase keys to client/.env to enable Google sign-in.");
    }
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  }

  async function resetPassword(email) {
    if (isFirebaseConfigured) {
      return sendPasswordResetEmail(auth, email);
    }
    const db = readLocalUsers();
    if (!db[email]) throw new Error("No account found with that email.");
    return true; // demo mode: pretend it was sent
  }

  async function logout() {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    isFirebaseConfigured,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

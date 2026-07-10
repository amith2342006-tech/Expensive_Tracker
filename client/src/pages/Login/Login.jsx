import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="panel auth-card">
        <h1 style={{ marginBottom: 6 }}>Welcome back</h1>
        <p className="text-secondary" style={{ marginBottom: 24, fontSize: 14 }}>
          Sign in to keep tracking your money.
        </p>
        {!isFirebaseConfigured && (
          <div className="badge badge-gold" style={{ marginBottom: 20, display: "block", padding: 10 }}>
            Demo mode — running on local storage. Add Firebase keys in client/.env for real cloud accounts.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div className="text-expense" style={{ fontSize: 13, marginBottom: 14 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {isFirebaseConfigured && (
          <button className="btn" style={{ width: "100%", marginTop: 10 }} onClick={loginWithGoogle}>
            Continue with Google
          </button>
        )}
        <div style={{ marginTop: 20, fontSize: 13, textAlign: "center" }} className="text-secondary">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, textAlign: "center" }} className="text-secondary">
          No account? <Link to="/register" className="text-income">Create one</Link>
        </div>
      </div>
    </div>
  );
}

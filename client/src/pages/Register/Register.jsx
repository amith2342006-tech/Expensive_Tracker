import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");
      await register(name, email, password);
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
        <h1 style={{ marginBottom: 6 }}>Create your account</h1>
        <p className="text-secondary" style={{ marginBottom: 24, fontSize: 14 }}>
          Takes less than a minute. Your data stays private to you.
        </p>
        {!isFirebaseConfigured && (
          <div className="badge badge-gold" style={{ marginBottom: 20, display: "block", padding: 10 }}>
            Demo mode — account is stored locally in this browser only.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
          {error && <div className="text-expense" style={{ fontSize: 13, marginBottom: 14 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <div style={{ marginTop: 20, fontSize: 13, textAlign: "center" }} className="text-secondary">
          Already have an account? <Link to="/login" className="text-income">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

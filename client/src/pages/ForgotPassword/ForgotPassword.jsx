import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(""); setBusy(true);
    try {
      await resetPassword(email);
      setStatus("If that account exists, a reset link/instructions have been sent.");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="panel auth-card">
        <h1 style={{ marginBottom: 6 }}>Reset your password</h1>
        <p className="text-secondary" style={{ marginBottom: 24, fontSize: 14 }}>
          Enter the email on your account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          {status && <div className="text-secondary" style={{ fontSize: 13, marginBottom: 14 }}>{status}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
            {busy ? "Sending…" : "Send reset instructions"}
          </button>
        </form>
        <div style={{ marginTop: 20, fontSize: 13, textAlign: "center" }} className="text-secondary">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}

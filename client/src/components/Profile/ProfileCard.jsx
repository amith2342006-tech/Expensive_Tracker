export default function ProfileCard({ user }) {
  return (
    <div className="panel card-pad" style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--income), var(--accent-blue))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 700, color: "#06150F",
        }}
      >
        {(user?.displayName || user?.email || "U")[0].toUpperCase()}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.displayName || "Unnamed User"}</div>
        <div className="text-secondary" style={{ fontSize: 14 }}>{user?.email}</div>
        <div className="text-muted mono" style={{ fontSize: 11, marginTop: 4 }}>UID: {user?.uid}</div>
      </div>
    </div>
  );
}

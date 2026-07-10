export default function Footer() {
  return (
    <footer style={{ padding: "20px 32px", color: "var(--text-muted)", fontSize: 12, textAlign: "center" }}>
      Expense Calculator Pro · Your data stays scoped to your account · {new Date().getFullYear()}
    </footer>
  );
}

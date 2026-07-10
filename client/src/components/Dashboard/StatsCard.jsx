import "./StatsCard.css";

export default function StatsCard({ label, value, sub, tone = "neutral", icon }) {
  return (
    <div className={"stats-card panel card-pad tone-" + tone}>
      <div className="stats-card-top">
        <span className="stats-card-icon">{icon}</span>
        <span className="text-muted stats-card-label">{label}</span>
      </div>
      <div className="stats-card-value">{value}</div>
      {sub && <div className="stats-card-sub text-secondary">{sub}</div>}
    </div>
  );
}

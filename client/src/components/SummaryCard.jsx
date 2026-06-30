import "./SummaryCard.css";

function SummaryCard({ icon, title, value, color }) {
  return (
    <div className="summary-card">
      <div
        className="summary-icon"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default SummaryCard;
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "../../utils/helpers";

export default function PieChartComp({ data, height = 280 }) {
  if (!data.length) {
    return <div className="text-muted" style={{ padding: 40, textAlign: "center" }}>No data yet — add an expense to see the breakdown.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={98}
          paddingAngle={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} stroke="var(--bg-panel)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ background: "#17233A", border: "1px solid #24314C", borderRadius: 8, color: "#EAF0F8" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

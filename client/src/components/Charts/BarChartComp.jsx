import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "../../utils/helpers";

export default function BarChartComp({ data, height = 280, barColorA = "#34D399", barColorB = "#FB7373" }) {
  if (!data.length) {
    return <div className="text-muted" style={{ padding: 40, textAlign: "center" }}>No data yet.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#1C2740" vertical={false} />
        <XAxis dataKey="name" stroke="#5C6B85" fontSize={12} tickLine={false} axisLine={{ stroke: "#24314C" }} />
        <YAxis stroke="#5C6B85" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ background: "#17233A", border: "1px solid #24314C", borderRadius: 8, color: "#EAF0F8" }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="income" fill={barColorA} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill={barColorB} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

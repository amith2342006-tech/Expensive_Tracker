import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "../../utils/helpers";

export default function LineChartComp({ data, height = 260, color = "#5B8DEF", dataKey = "amount" }) {
  if (!data.length) {
    return <div className="text-muted" style={{ padding: 40, textAlign: "center" }}>No trend data yet.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1C2740" vertical={false} />
        <XAxis dataKey="label" stroke="#5C6B85" fontSize={12} tickLine={false} axisLine={{ stroke: "#24314C" }} />
        <YAxis stroke="#5C6B85" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ background: "#17233A", border: "1px solid #24314C", borderRadius: 8, color: "#EAF0F8" }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill="url(#trendFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

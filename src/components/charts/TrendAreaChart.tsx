import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TrendAreaChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
  variant?: "area" | "line";
}

export function TrendAreaChart({ data, xKey, yKey, color = "#ef4444", height = 220, valueFormatter, variant = "area" }: TrendAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e8e6" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={valueFormatter} width={44} />
        <Tooltip formatter={(value) => [valueFormatter ? valueFormatter(Number(value)) : value, ""] as [string | number, string]} contentStyle={{ borderRadius: 10, border: "1px solid #e6e8e6", fontSize: 13 }} />
        {variant === "area" ? (
          <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} fill="url(#trend-fill)" isAnimationActive={false} dot={{ r: 3, fill: color }} />
        ) : (
          <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} isAnimationActive={false} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

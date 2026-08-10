import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Series {
  key: string;
  label: string;
  color: string;
}

interface BarComparisonChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  height?: number;
  valueFormatter?: (v: number) => string;
}

export function BarComparisonChart({ data, xKey, series, height = 260, valueFormatter }: BarComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e8e6" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={valueFormatter} width={44} />
        <Tooltip
          formatter={(value, name) => [valueFormatter ? valueFormatter(Number(value)) : value, name] as [string | number, string]}
          contentStyle={{ borderRadius: 10, border: "1px solid #e6e8e6", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[6, 6, 0, 0]} isAnimationActive={false} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

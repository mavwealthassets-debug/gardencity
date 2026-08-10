import { Area, AreaChart, ResponsiveContainer } from "recharts";

const TONE_HEX: Record<string, string> = {
  green: "#1f9142",
  blue: "#3b82f6",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
};

export function AreaSparkline({ data, tone = "green" }: { data: number[]; tone?: keyof typeof TONE_HEX }) {
  const color = TONE_HEX[tone];
  const chartData = data.map((value, i) => ({ i, value }));
  return (
    <div className="h-full w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.75} fill={`url(#spark-${tone})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}

export function DonutChart({ data, centerLabel, centerValue, size = 200 }: DonutChartProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.label} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name] as [number, string]}
            contentStyle={{ borderRadius: 10, border: "1px solid #e6e8e6", fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="text-2xl font-bold text-neutral-900">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-neutral-500">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function DonutLegend({ data }: { data: DonutDatum[] & { count?: number }[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {data.map((d) => (
        <li key={d.label} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />
          <span className="text-neutral-600">{d.label}</span>
          <span className="ml-auto font-semibold text-neutral-900">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

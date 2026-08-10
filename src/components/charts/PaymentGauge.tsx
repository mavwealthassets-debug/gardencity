import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface PaymentGaugeProps {
  percent: number;
  size?: number;
}

/** Semicircular progress gauge used for "amount paid" style visualizations. */
export function PaymentGauge({ percent, size = 180 }: PaymentGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const data = [
    { name: "paid", value: clamped },
    { name: "remaining", value: 100 - clamped },
  ];

  return (
    <div className="relative shrink-0" style={{ width: size, height: size * 0.72 }}>
      <div className="absolute inset-x-0 top-0" style={{ height: size * 0.62 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius="76%"
              outerRadius="100%"
              cy="100%"
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill="#087a2a" />
              <Cell fill="#e5e9e6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center leading-none" style={{ top: size * 0.36 }}>
        <span className="text-xl font-bold text-neutral-900">{clamped.toFixed(0)}%</span>
        <span className="mt-1.5 text-xs leading-none text-neutral-500">Paid</span>
      </div>
    </div>
  );
}

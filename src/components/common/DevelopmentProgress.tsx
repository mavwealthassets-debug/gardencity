import { ProgressBar } from "./ProgressBar";

export interface DevelopmentProgressItem {
  label: string;
  percent: number;
}

export function DevelopmentProgress({ items }: { items: DevelopmentProgressItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((d) => (
        <div key={d.label} className="text-center">
          <p className="text-sm font-semibold text-neutral-800">{d.percent}%</p>
          <p className="mb-2 truncate text-xs text-neutral-500">{d.label}</p>
          <ProgressBar percent={d.percent} />
        </div>
      ))}
    </div>
  );
}

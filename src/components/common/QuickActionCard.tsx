import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function QuickActionCard({ icon: Icon, label, onClick }: QuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-colors hover:border-brand-200 hover:bg-brand-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon size={18} />
      </span>
      <span className="text-xs font-medium text-neutral-700">{label}</span>
    </button>
  );
}

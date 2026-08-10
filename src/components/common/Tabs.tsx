import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, defaultValue, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.value);
  const active = value ?? internal;

  function select(v: string) {
    setInternal(v);
    onChange?.(v);
  }

  return (
    <div role="tablist" className={cn("flex items-center gap-1 overflow-x-auto border-b border-border scrollbar-none", className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => select(tab.value)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive ? "text-brand-700" : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            {tab.icon}
            {tab.label}
            {typeof tab.count === "number" && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-semibold", isActive ? "bg-brand-50 text-brand-700" : "bg-surface-muted text-neutral-500")}>
                {tab.count}
              </span>
            )}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        );
      })}
    </div>
  );
}

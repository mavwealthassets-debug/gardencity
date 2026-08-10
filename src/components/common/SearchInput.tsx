import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
}

export function SearchInput({ value, onChange, className, containerClassName, placeholder = "Search...", ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "h-10 w-full rounded-[10px] border border-border-strong bg-surface pl-9 pr-8 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:border-brand-500",
          className
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

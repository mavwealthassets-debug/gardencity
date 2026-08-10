import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-neutral-500", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1">
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-brand-700">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-neutral-800" : undefined}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}

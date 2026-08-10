import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  const pages = pageWindow(page, totalPages);
  const start = totalItems && pageSize ? (page - 1) * pageSize + 1 : undefined;
  const end = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
      {totalItems !== undefined && (
        <p className="text-neutral-500">
          Showing <span className="font-medium text-neutral-800">{start}</span>–<span className="font-medium text-neutral-800">{end}</span> of{" "}
          <span className="font-medium text-neutral-800">{totalItems}</span>
        </p>
      )}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong text-neutral-500 hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1.5 text-neutral-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-medium",
                p === page ? "bg-brand-600 text-white" : "border border-border-strong text-neutral-600 hover:bg-surface-muted"
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong text-neutral-500 hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  const arr = Array.from(set)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  arr.forEach((p, i) => {
    if (i > 0 && p - (arr[i - 1] as number) > 1) result.push("…");
    result.push(p);
  });
  return result;
}

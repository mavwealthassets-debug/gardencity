import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
}

const WIDTH_CLASSES: Record<NonNullable<DrawerProps["width"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

export function Drawer({ open, onClose, title, subtitle, children, footer, width = "md" }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/50 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "relative z-10 flex h-full w-full flex-col border-l border-border bg-surface shadow-drawer animate-slide-in-right",
          WIDTH_CLASSES[width]
        )}
      >
        {title && (
          <div className="flex items-start justify-between gap-3 border-b border-border p-5">
            <div className="min-w-0">
              <h2 id="drawer-title" className="text-base font-semibold text-neutral-900">
                {title}
              </h2>
              {subtitle && <div className="mt-1 text-sm text-neutral-500">{subtitle}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:bg-surface-muted hover:text-neutral-700"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex flex-wrap items-center gap-2 border-t border-border p-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

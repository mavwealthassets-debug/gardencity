import { useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: (props: { onClick: () => void; open: boolean }) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, children, align = "right", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative inline-block">
      {trigger({ onClick: () => setOpen((v) => !v), open })}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-40 mt-2 min-w-[200px] rounded-lg border border-border bg-surface py-1.5 shadow-popover animate-fade-in",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      role="menuitem"
      type="button"
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-neutral-700 hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export function DropdownSeparator() {
  return <div className="my-1.5 h-px bg-border" role="separator" />;
}

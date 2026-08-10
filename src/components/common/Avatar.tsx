import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const PALETTE = ["bg-brand-100 text-brand-800", "bg-status-info-bg text-status-info", "bg-status-purple-bg text-status-purple", "bg-status-teal-bg text-status-teal", "bg-status-booked-bg text-status-booked"];

function paletteFor(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  return PALETTE[code % PALETTE.length];
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        SIZE_CLASSES[size],
        paletteFor(name),
        className
      )}
      aria-hidden="true"
    >
      {initials(name) || "?"}
    </span>
  );
}

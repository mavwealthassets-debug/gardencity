import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  eyebrow?: boolean;
  className?: string;
}

const SIZE = {
  sm: "h-[42px] w-[198px]",
  md: "h-[50px] w-[235px]",
  lg: "h-[66px] w-[310px]",
};

export function Logo({ size = "md", withTagline = true, className }: LogoProps) {
  if (!withTagline) {
    return (
      <div className={cn("h-10 w-10 shrink-0 overflow-hidden", className)}>
        <img
          src="/garden-city-logo.webp"
          alt="Garden City"
          className="h-10 w-auto max-w-none object-contain object-left"
        />
      </div>
    );
  }

  return (
    <img
      src="/garden-city-logo.webp"
      alt="Ram Rattan Garden City"
      className={cn("block shrink-0 object-contain object-left", SIZE[size], className)}
    />
  );
}

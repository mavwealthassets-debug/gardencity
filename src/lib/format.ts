/** Formats a number as Indian Rupees using lakh/crore grouping, e.g. ₹1,28,50,000 */
export function formatINR(amount: number, options?: { decimals?: number }): string {
  const decimals = options?.decimals ?? 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(amount);
}

/** Formats a large rupee amount into compact lakh/crore form, e.g. ₹12.85 Cr, ₹92.50 L */
export function formatINRCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN")}`;
}

export function formatNumberIN(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatDate(value: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatRelativeTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = date.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 525600],
    ["month", 43800],
    ["day", 1440],
    ["hour", 60],
    ["minute", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, minutes] of units) {
    if (Math.abs(diffMin) >= minutes || unit === "minute") {
      return rtf.format(Math.round(diffMin / minutes), unit);
    }
  }
  return rtf.format(0, "minute");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

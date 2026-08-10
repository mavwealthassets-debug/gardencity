import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center py-16">
      <Loader2 className="animate-spin text-brand-600" size={28} aria-label="Loading" />
    </div>
  );
}

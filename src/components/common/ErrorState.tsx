import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", description = "We couldn't load this data. Please try again.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-sold-bg text-status-sold">
        <AlertCircle size={22} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-800">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

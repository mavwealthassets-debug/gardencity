import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (id: string, describedBy: string | undefined) => ReactNode;
  className?: string;
}

function FieldWrapper({ label, hint, error, required, children, className }: FieldWrapperProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="ml-0.5 text-status-sold">*</span>}
        </label>
      )}
      {children(id, describedBy)}
      {hint && !error && (
        <p id={hintId} className="text-xs text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-status-sold">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "h-10 w-full rounded-[10px] border border-border-strong bg-surface px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:border-brand-500 disabled:bg-surface-muted disabled:text-neutral-400";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputFieldProps>(({ label, hint, error, required, className, ...props }, ref) => (
  <FieldWrapper label={label} hint={hint} error={error} required={required}>
    {(id, describedBy) => (
      <input
        ref={ref}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        required={required}
        className={cn(inputBase, error && "border-status-sold", className)}
        {...props}
      />
    )}
  </FieldWrapper>
));
Input.displayName = "Input";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({ label, hint, error, required, className, ...props }, ref) => (
  <FieldWrapper label={label} hint={hint} error={error} required={required}>
    {(id, describedBy) => (
      <textarea
        ref={ref}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        required={required}
        className={cn(inputBase, "h-auto min-h-[88px] py-2 resize-y", error && "border-status-sold", className)}
        {...props}
      />
    )}
  </FieldWrapper>
));
Textarea.displayName = "Textarea";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectFieldProps>(({ label, hint, error, required, className, children, ...props }, ref) => (
  <FieldWrapper label={label} hint={hint} error={error} required={required}>
    {(id, describedBy) => (
      <select
        ref={ref}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        required={required}
        className={cn(inputBase, "pr-8", error && "border-status-sold", className)}
        {...props}
      >
        {children}
      </select>
    )}
  </FieldWrapper>
));
Select.displayName = "Select";

export function Checkbox({ label, className, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={cn("flex cursor-pointer items-start gap-2 text-sm text-neutral-700", className)}>
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong text-brand-700 focus-visible:outline-brand-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

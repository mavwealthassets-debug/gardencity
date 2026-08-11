import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, description, crumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-surface px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
      <div className="min-w-0">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-1.5" />}
        <h1 className="break-words text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 [&>button]:max-sm:flex-1">{actions}</div>}
    </div>
  );
}

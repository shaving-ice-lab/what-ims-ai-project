import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as React from "react";

interface WorkbenchShellProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  headerTabs?: React.ReactNode;
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  results?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function WorkbenchShell({
  title,
  description,
  badge,
  actions,
  meta,
  headerTabs,
  toolbar,
  sidebar,
  results,
  footer,
  children,
}: WorkbenchShellProps) {
  return (
    <div className="space-y-6">
      <div className="workbench-header">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            {badge ? (
              <Badge
                variant="secondary"
                className="rounded-lg px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {badge}
              </Badge>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight text-foreground/90">
              {title}
            </h1>
            {actions ? (
              <div className="ml-auto flex flex-wrap items-center gap-2">
                {actions}
              </div>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          {meta ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {meta}
            </div>
          ) : null}
          {headerTabs ? (
            <div className="border-t border-border/60 pt-2">{headerTabs}</div>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6",
          sidebar ? "lg:grid-cols-[260px_minmax(0,1fr)]" : "grid-cols-1"
        )}
      >
        {sidebar ? (
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {sidebar}
          </aside>
        ) : null}
        <section className="space-y-4">
          {toolbar ? (
            <div className="sticky top-16 z-20">
              <div className="workbench-toolbar">{toolbar}</div>
            </div>
          ) : null}
          {children}
          {results ? (
            <div className="workbench-results space-y-3">{results}</div>
          ) : null}
          {footer}
        </section>
      </div>
    </div>
  );
}

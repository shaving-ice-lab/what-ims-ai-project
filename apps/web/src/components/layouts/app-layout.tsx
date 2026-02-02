"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  role: "admin" | "store" | "supplier";
}

export function AppLayout({ children, role }: AppLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="app-shell gradient-noise min-h-screen text-foreground">
      <AppSidebar
        role={role}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      <AppHeader collapsed={collapsed} role={role} />
      <main
        className={cn(
          "relative min-h-screen pt-16 transition-all duration-300",
          collapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Convenience wrappers for each role
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout role="admin">{children}</AppLayout>;
}

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout role="store">{children}</AppLayout>;
}

export function SupplierLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout role="supplier">{children}</AppLayout>;
}

import { TooltipProvider } from "@/components/ui/tooltip";
import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";

// Custom render function with providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };


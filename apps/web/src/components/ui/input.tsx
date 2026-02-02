import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        data-ui="input"
        className={cn(
          "flex h-9 w-full rounded-lg border border-border/60 bg-background/60 px-3 py-1 text-base shadow-sm backdrop-blur transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground/60",
          "hover:border-muted-foreground/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-primary/70",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/60",
          "md:text-sm",
          error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };


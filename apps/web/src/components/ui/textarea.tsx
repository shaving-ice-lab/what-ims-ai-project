import { cn } from "@/lib/utils";
import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-base shadow-sm backdrop-blur transition-all duration-200 resize-y",
          "placeholder:text-muted-foreground/60",
          "hover:border-muted-foreground/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-primary/70",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/60",
          "md:text-sm",
          error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
          className
        )}
        data-ui="textarea"
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };


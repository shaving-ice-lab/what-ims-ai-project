import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface SLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  text?: string;
  fullscreen?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8",
};

const SLoading = React.forwardRef<HTMLDivElement, SLoadingProps>(
  ({ className, size = "default", text, fullscreen, ...props }, ref) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          fullscreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
          className
        )}
        {...props}
      >
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );

    return content;
  }
);
SLoading.displayName = "SLoading";

export { SLoading };


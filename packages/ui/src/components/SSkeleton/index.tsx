import * as React from "react";
import { cn } from "../../lib/utils";

export interface SSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const SSkeleton = React.forwardRef<HTMLDivElement, SSkeletonProps>(
  ({ className, variant = "rectangular", width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-primary/10",
          variant === "circular" && "rounded-full",
          variant === "text" && "rounded h-4",
          variant === "rectangular" && "rounded-md",
          className
        )}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
SSkeleton.displayName = "SSkeleton";

export { SSkeleton };


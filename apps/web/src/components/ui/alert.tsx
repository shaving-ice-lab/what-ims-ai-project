import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-4 text-sm shadow-sm backdrop-blur-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-card/60 text-foreground border-border/60",
        destructive:
          "bg-destructive/8 border-destructive/35 text-destructive [&>svg]:text-destructive",
        success:
          "bg-emerald-500/8 border-emerald-500/35 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-500",
        warning:
          "bg-amber-500/8 border-amber-500/35 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-500",
        info:
          "bg-blue-500/8 border-blue-500/35 text-blue-600 dark:text-blue-400 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  const resolvedVariant = variant ?? "default";
  return (
    <div
      ref={ref}
      role="alert"
      data-ui="alert"
      data-variant={resolvedVariant}
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };


import { Inbox } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface SEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  description?: React.ReactNode;
}

const SEmpty = React.forwardRef<HTMLDivElement, SEmptyProps>(
  ({ className, icon, description = "暂无数据", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-8 text-center",
          className
        )}
        {...props}
      >
        {icon || (
          <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
        )}
        <p className="text-sm text-muted-foreground">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }
);
SEmpty.displayName = "SEmpty";

export { SEmpty };


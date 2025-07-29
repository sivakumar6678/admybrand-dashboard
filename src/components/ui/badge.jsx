import React from "react";
import { cn } from "../../utils/cn";

export function Badge({ children, className = "", variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variant === "default"
          ? "bg-primary/10 text-primary ring-primary/20"
          : variant === "secondary"
          ? "bg-muted text-muted-foreground ring-border"
          : variant === "outline"
          ? "bg-transparent text-foreground ring-border"
          : "",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
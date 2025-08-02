import { cn } from "../../utils/cn";

export function Badge({ children, className = "", variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide border-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-105",
        variant === "default"
          ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20"
          : variant === "secondary"
          ? "bg-muted/80 text-muted-foreground border-border hover:bg-muted"
          : variant === "outline"
          ? "bg-transparent text-foreground border-border hover:bg-muted/50"
          : variant === "destructive"
          ? "bg-red-100/80 text-red-900 dark:bg-red-900/40 dark:text-red-200 border-red-500/30 dark:border-red-400/40 hover:bg-red-100 dark:hover:bg-red-900/50"
          : "",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
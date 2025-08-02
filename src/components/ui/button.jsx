import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold tracking-wide ring-offset-background transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md hover:shadow-lg backdrop-blur-sm border-2 border-transparent",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-primary/20 hover:shadow-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 shadow-destructive/20 hover:shadow-destructive/30",
        outline:
          "border-input bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 shadow-secondary/20",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-500 ease-in-out",
        link: "text-primary underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-lg px-10",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
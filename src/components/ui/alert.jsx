import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../utils/cn"

const alertVariants = cva(
  "relative w-full rounded-xl border-2 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-5 [&>svg]:top-5 [&>svg]:text-foreground [&>svg]:drop-shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-background/90 text-foreground border-border",
        destructive:
          "border-red-500/60 text-red-900 dark:text-red-100 bg-red-50/80 dark:bg-red-950/40 [&>svg]:text-red-600 dark:[&>svg]:text-red-400 [&>*]:text-red-900 dark:[&>*]:text-red-100 shadow-red-500/20",
        warning:
          "border-yellow-500/60 text-yellow-900 dark:text-yellow-100 bg-yellow-50/80 dark:bg-yellow-950/40 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 [&>*]:text-yellow-900 dark:[&>*]:text-yellow-100 shadow-yellow-500/20",
        success:
          "border-green-500/60 text-green-900 dark:text-green-100 bg-green-50/80 dark:bg-green-950/40 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 [&>*]:text-green-900 dark:[&>*]:text-green-100 shadow-green-500/20",
        info:
          "border-blue-500/60 text-blue-900 dark:text-blue-100 bg-blue-50/80 dark:bg-blue-950/40 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400 [&>*]:text-blue-900 dark:[&>*]:text-blue-100 shadow-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-semibold leading-none tracking-wide text-inherit", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed text-inherit", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../utils/cn"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
<<<<<<< HEAD
          "border-red-500/50 text-red-900 dark:text-red-100 bg-red-50 dark:bg-red-950/30 [&>svg]:text-red-600 dark:[&>svg]:text-red-400 [&>*]:text-red-900 dark:[&>*]:text-red-100",
=======
          "border-red-500/50 text-red-900 dark:text-red-100 bg-red-50 dark:bg-red-950/20 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
>>>>>>> 437220359483982c1e056d3180b138917c981e5e
        warning:
          "border-yellow-500/50 text-yellow-900 dark:text-yellow-100 bg-yellow-50 dark:bg-yellow-950/30 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 [&>*]:text-yellow-900 dark:[&>*]:text-yellow-100",
        success:
          "border-green-500/50 text-green-900 dark:text-green-100 bg-green-50 dark:bg-green-950/30 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 [&>*]:text-green-900 dark:[&>*]:text-green-100",
        info:
          "border-blue-500/50 text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-950/30 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400 [&>*]:text-blue-900 dark:[&>*]:text-blue-100",
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
    className={cn("mb-1 font-medium leading-none tracking-tight text-inherit", className)}
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

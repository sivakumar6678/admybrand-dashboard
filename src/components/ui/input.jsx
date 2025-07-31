import * as React from "react"
import { cn } from "../../utils/cn"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white text-black px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 transition-colors duration-300 ease-in-out",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
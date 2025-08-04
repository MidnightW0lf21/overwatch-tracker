
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-primary transition-all", 
                   className?.includes('text-red-400') ? 'bg-red-400' :
                   className?.includes('text-green-400') ? 'bg-green-400' :
                   className?.includes('text-blue-400') ? 'bg-blue-400' :
                   className?.includes('bg-yellow-900/10') ? 'bg-yellow-600' :
                   className?.includes('bg-slate-500/10') ? 'bg-slate-400' :
                   className?.includes('bg-amber-500/10') ? 'bg-amber-400' :
                   className?.includes('bg-purple-500/10') ? 'bg-purple-400' :
                   className?.includes('bg-fuchsia-500/20') ? 'bg-fuchsia-400' :
                   'bg-primary'
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ease-out cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#DEEBFF] hover:bg-[#B3D4FF] active:bg-[#4C9AFF]/30 dark:bg-[#0052CC]/20 dark:hover:bg-[#0052CC]/30 dark:active:bg-[#0052CC]/40 border-[#0052CC]/20 hover:border-[#0052CC]/40 text-[#0052CC] dark:text-[#4C9AFF]",
        secondary:
          "bg-[#DEEBFF] hover:bg-[#B3D4FF] active:bg-[#4C9AFF]/30 dark:bg-[#0747A6]/20 dark:hover:bg-[#0747A6]/30 dark:active:bg-[#0747A6]/40 border-[#0747A6]/20 hover:border-[#0747A6]/40 text-[#0747A6] dark:text-[#6B9AFF]",
        accent:
          "bg-[#DEEBFF] hover:bg-[#B3D4FF] active:bg-[#4C9AFF]/30 dark:bg-[#4C9AFF]/20 dark:hover:bg-[#4C9AFF]/30 dark:active:bg-[#4C9AFF]/40 border-[#4C9AFF]/20 hover:border-[#4C9AFF]/40 text-[#4C9AFF] dark:text-[#6B9AFF]",
        success:
          "bg-[#E3FCEF] hover:bg-[#ABF5D1] active:bg-[#36B37E]/30 dark:bg-[#36B37E]/20 dark:hover:bg-[#36B37E]/30 dark:active:bg-[#36B37E]/40 border-[#36B37E]/20 hover:border-[#36B37E]/40 text-[#006644] dark:text-[#79F2C0]",
        warning:
          "bg-[#FFFAE6] hover:bg-[#FFF0B3] active:bg-[#FFAB00]/30 dark:bg-[#FFAB00]/20 dark:hover:bg-[#FFAB00]/30 dark:active:bg-[#FFAB00]/40 border-[#FFAB00]/20 hover:border-[#FFAB00]/40 text-[#974F00] dark:text-[#FFC400]",
        danger:
          "bg-[#FFEBE6] hover:bg-[#FFBDAD] active:bg-[#DE350B]/30 dark:bg-[#DE350B]/20 dark:hover:bg-[#DE350B]/30 dark:active:bg-[#DE350B]/40 border-[#DE350B]/20 hover:border-[#DE350B]/40 text-[#BF2600] dark:text-[#FF8F73]",
        neutral:
          "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300",
      },
      size: {
        sm: "px-3 py-1 text-xs",
        default: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
  pulseColor?: string
}

const AtlassianBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, pulse = false, pulseColor, children, ...props }, ref) => {
    const getPulseColor = () => {
      if (pulseColor) return pulseColor

      switch (variant) {
        case "primary": return "#0052CC"
        case "secondary": return "#0747A6"
        case "accent": return "#4C9AFF"
        case "success": return "#36B37E"
        case "warning": return "#FFAB00"
        case "danger": return "#DE350B"
        default: return "#0052CC"
      }
    }

    return (
      <div
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {pulse && (
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: getPulseColor() }}
          />
        )}
        <span className="font-medium">{children}</span>
      </div>
    )
  }
)
AtlassianBadge.displayName = "AtlassianBadge"

export { AtlassianBadge, badgeVariants }
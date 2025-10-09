"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C9AFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white hover:from-[#0747A6] hover:to-[#4C9AFF] active:from-[#003d99] active:to-[#003d99] hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#0052CC]/25",
        secondary:
          "bg-transparent border border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC]/10 active:bg-[#0052CC]/20 hover:border-[#0747A6] active:border-[#003d99]",
        outline:
          "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 hover:border-[#4C9AFF] dark:hover:border-[#4C9AFF] active:scale-[0.98]",
        ghost:
          "text-slate-600 dark:text-slate-300 hover:bg-[#0052CC]/10 active:bg-[#0052CC]/20 hover:text-[#0052CC] active:text-[#0747A6]",
        link:
          "text-[#0052CC] underline-offset-4 hover:underline hover:text-[#0747A6] active:text-[#003d99]",
        danger:
          "bg-[#DE350B] text-white hover:bg-[#BF2600] active:bg-[#9F2200] hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#DE350B]/25",
        success:
          "bg-[#36B37E] text-white hover:bg-[#2E9A6A] active:bg-[#267E56] hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#36B37E]/25",
        warning:
          "bg-[#FFAB00] text-slate-900 hover:bg-[#E6990A] active:bg-[#CC8700] hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#FFAB00]/25",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
        xl: "h-14 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const AtlassianButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
AtlassianButton.displayName = "AtlassianButton"

export { AtlassianButton, buttonVariants }
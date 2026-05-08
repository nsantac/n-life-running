import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-white shadow-md hover:bg-emerald-600 active:bg-emerald-700",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300",
        outline:
          "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        success:
          "bg-emerald-500 text-white hover:bg-emerald-600",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-12 w-12",
        full: "h-14 w-full px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

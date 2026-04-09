import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'gold' | 'destructive'
    size?: 'default' | 'sm' | 'lg' | 'icon'
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-navy text-white hover:bg-navy-700': variant === 'default',
          'border-2 border-navy text-navy hover:bg-navy hover:text-white': variant === 'outline',
          'hover:bg-gray-100 text-gray-700': variant === 'ghost',
          'bg-gold text-white hover:bg-gold-dark': variant === 'gold',
          'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
        },
        {
          'h-10 px-6 py-2 text-sm': size === 'default',
          'h-8 px-4 py-1 text-xs': size === 'sm',
          'h-12 px-8 py-3 text-base': size === 'lg',
          'h-10 w-10 p-0': size === 'icon',
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

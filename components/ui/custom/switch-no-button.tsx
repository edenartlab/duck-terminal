'use client'

import { useFormField } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import * as React from 'react'

type SwitchProps = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const SwitchNoButton = React.forwardRef<HTMLDivElement, SwitchProps>(
  (
    { checked = false, onCheckedChange, disabled, className, ...props },
    ref,
  ) => {
    const { formItemId } = useFormField()

    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    return (
      <div
        aria-labelledby={`${formItemId}-label`}
        ref={ref}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={e => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onCheckedChange?.(!checked)
          }
        }}
        className={cn(
          'inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-input',
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </div>
    )
  },
)

SwitchNoButton.displayName = 'SwitchNoButton'

export { SwitchNoButton }

'use client'

import { cn } from '@/lib/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const Slider = React.forwardRef<HTMLElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center group touch-pan-y',
          className,
        )}
        // onValueChange={setValue}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-8 w-full grow overflow-hidden rounded-l-md bg-accent border border-input border-r-0">
          <SliderPrimitive.Range className="absolute h-full bg-muted-foreground/60 group-hover:bg-muted-foreground/70" />
        </SliderPrimitive.Track>
      </SliderPrimitive.Root>
    )
  },
)

Slider.displayName = SliderPrimitive.Root.displayName as string

export { Slider }

'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean
}

const SliderWithTooltip = React.forwardRef<HTMLElement, SliderProps>(
  ({ className, showTooltip = false, ...props }, ref) => {
    // const [value, setValue] = React.useState<number[]>(
    //   (props.value as number[]) ?? [0],
    // )
    const [showTooltipState, setShowTooltipState] = React.useState(false)

    const handlePointerDown = () => {
      setShowTooltipState(true)
    }

    const handlePointerUp = () => {
      setShowTooltipState(false)
    }

    React.useEffect(() => {
      document.addEventListener('pointerup', handlePointerUp)
      return () => {
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }, [])

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center group touch-pan-y',
          className,
        )}
        // onValueChange={setValue}
        onPointerDown={handlePointerDown}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-8 w-full grow overflow-hidden rounded-md bg-accent border border-input">
          <SliderPrimitive.Range className="absolute h-full bg-muted-foreground/60 group-hover:bg-muted-foreground/70" />
        </SliderPrimitive.Track>
        <TooltipProvider>
          <Tooltip open={showTooltip && showTooltipState}>
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb
                className="block h-10 w-3 rounded-md border-2 border-muted-foreground/70 hover:border-accent-foreground bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary disabled:pointer-events-none disabled:opacity-50 cursor-col-resize shadow dark:shadow-accent/60"
                onMouseEnter={() => setShowTooltipState(true)}
                onMouseLeave={() => setShowTooltipState(false)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-popover-foreground text-popover">
              <p>{props.value && props.value.length ? props.value[0] : '-'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SliderPrimitive.Root>
    )
  },
)

SliderWithTooltip.displayName = SliderPrimitive.Root.displayName as string

export { SliderWithTooltip }

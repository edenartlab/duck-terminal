import { DialogPortal } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowLeftIcon } from 'lucide-react'
import * as React from 'react'

const DialogOverlayScrollable = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed grid justify-items-center md:py-2 overflow-auto inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlayScrollable.displayName = DialogPrimitive.Overlay.displayName

const DialogContentScrollable = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlayScrollable className="backdrop-filter backdrop-blur-sm">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'relative z-50 grid max-w-[100dvw] p-0 gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute w-8 h-8 top-0 left-0 rounded-t-none rounded-l-none rounded-tl-lg flex items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none bg-accent data-[state=open]:text-muted-foreground">
            <ArrowLeftIcon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlayScrollable>
    </DialogPortal>
  )
})
DialogContentScrollable.displayName = DialogPrimitive.Content.displayName

export { DialogContentScrollable }

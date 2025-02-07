'use client'

import DialogContentOverlayBlur from '@/components/ui/custom/dialog-content-overlay-blur'
import { Dialog, DialogPortal, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ForwardedRef, PropsWithChildren, ReactNode, forwardRef } from 'react'

type Props = {
  triggerChildren: ReactNode
  onSelect?: () => void
  onOpenChange: (open: boolean) => void
} & PropsWithChildren

const DialogMenuItem = forwardRef(
  (props: Props, forwardedRef: ForwardedRef<HTMLDivElement>) => {
    const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
      props
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            className="cursor-pointer"
            onSelect={event => {
              event.preventDefault()
              onSelect && onSelect()
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogPortal>
          <DialogContentOverlayBlur>{children}</DialogContentOverlayBlur>
        </DialogPortal>
      </Dialog>
    )
  },
)
DialogMenuItem.displayName = 'DialogMenuItem'

export default DialogMenuItem

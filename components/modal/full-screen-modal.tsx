'use client'

import { DialogContentScrollable } from '@/components/ui/custom/dialog-content-scrollable'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'

type Props = {
  title?: string
  description?: string
  className?: string
} & PropsWithChildren

const FullScreenModal = ({
  title,
  description,
  children,
  className,
}: Props) => {
  const [open, setOpen] = useState(true)
  const [disableEsc, setDisableEsc] = useState(false)
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('lightbox-open', () => {
      setDisableEsc(true)
    })

    window.addEventListener('lightbox-close', () => {
      setDisableEsc(false)
    })

    return () => {
      window.removeEventListener('lightbox-open', () => {})
      window.removeEventListener('lightbox-close', () => {})
    }
  }, [])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = ''
      }, 0)

      return () => clearTimeout(timer)
    } else {
      document.body.style.pointerEvents = 'auto'
    }
  }, [open])

  const handleOpenChange = (isOpen: boolean) => {
    if (disableEsc) return
    setOpen(isOpen)
    router.back()
  }

  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleOpenChange}>
      <DialogContentScrollable
        className={cn([
          `w-full md:w-[calc(100dvw_-_32px)] h-fit overflow-x-hidden`,
          className,
        ])}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        {children}
      </DialogContentScrollable>
    </Dialog>
  )
}

export default FullScreenModal

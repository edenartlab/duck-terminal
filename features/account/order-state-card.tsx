'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertCircleIcon, CircleCheck } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export const OrderStateCard = () => {
  const query = useSearchParams()
  const isCancelled = query.get('state') === 'cancelled'
  const isSuccess = query.get('state') === 'success'

  const [isOpen, setIsOpen] = React.useState(isCancelled || isSuccess)

  const dialogTitle = isCancelled ? 'Order Cancelled' : 'Order Successful'
  const dialogDescription = isCancelled
    ? 'Your order has been cancelled.'
    : 'Your order has been placed successfully.'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[calc(100%-32px)] sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          {isSuccess ? (
            <CircleCheck size={48} className="text-success mx-auto" />
          ) : (
            <AlertCircleIcon size={48} className="text-warning mx-auto" />
          )}
          <div className="space-y-2">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </div>
        </DialogHeader>
        {isSuccess && (
          <Link href="/create">
            <Button type="button" variant="outline" className="w-full">
              Start creating
            </Button>
          </Link>
        )}
      </DialogContent>
    </Dialog>
  )
}

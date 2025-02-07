'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import React from 'react'

const ManageAccountCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Account</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Manage Account</Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[calc(100%-32px)] sm:!max-w-fit !p-0 !border-none !bg-transparent">
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle>Manage Account</DialogTitle>
                <DialogDescription>
                  update profile image, email, etc
                </DialogDescription>
              </DialogHeader>
            </VisuallyHidden>

            {/* <UserProfile routing="hash" /> */}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default ManageAccountCard

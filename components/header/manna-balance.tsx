'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import MannaBalanceTable from '@/features/account/manna-balance-table'
import { useAuthState } from '@/hooks/use-auth-state'
import { CoinsIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const MannaValue = ({ value }: { value: number }) => {
  return (
    <>
      <CoinsIcon className="mr-1 h-4 w-4" />
      <span>{Math.round(value || 0).toLocaleString()}</span>
    </>
  )
}

const MannaBalance = () => {
  const { isSignedIn, balance, subscriptionBalance, foreverBalance } =
    useAuthState()

  if (isSignedIn && (!balance || balance <= 0)) {
    return (
      <Button asChild size="sm" variant="secondary">
        <Link href={'/settings/subscription'}>
          <CoinsIcon className="mr-1 h-4 w-4" />
          Get Manna!
        </Link>
      </Button>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger title="View manna balance breakdown" asChild>
        <Button variant="ghost" className="text-xs px-2 flex focus:!ring-0">
          <MannaValue value={balance} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        collisionPadding={16}
        className="text-xs flex flex-col p-0 w-64"
      >
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            className="text-sm group px-3 py-2 bg-accent/70 text-accent-foreground flex items-center w-full justify-between border border-t-0 border-l-0 border-r-0 rounded-b-none"
            href={'/settings/subscription'}
          >
            Manna Balance
            <div className="underline group-hover:text-popover-foreground">
              Get more!
            </div>
          </Link>
          {/*px-3 py-2 text-sm text-accent-foreground flex w-full justify-between bg-accent/70 mt-0 caption-top border border-t-0 border-l-0 border-r-0 border-b-secondary overflow-hidden rounded-t-md*/}
        </DropdownMenuItem>
        <MannaBalanceTable
          subscriptionBalance={subscriptionBalance}
          foreverBalance={foreverBalance}
          totalBalance={balance}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MannaBalance

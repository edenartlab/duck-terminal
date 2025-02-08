import { cn } from '@/lib/utils'
import { LockIcon } from 'lucide-react'
import React from 'react'

type Props = {
  className?: string
}

const PrivateIcon = ({ className }: Props) => {
  return (
    <LockIcon
      className={cn([
        'absolute h-4 w-4 right-2 top-2 text-white bg-accent/50 rounded-sm p-0.5 z-20',
        className,
      ])}
    />
  )
}

export default PrivateIcon

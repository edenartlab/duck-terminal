import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { EllipsisIcon } from 'lucide-react'
import { PropsWithChildren, ReactNode } from 'react'

type Props = {
  size?: 'sm'
  label?: ReactNode
  className?: string
  onOpenChange?: (open: boolean) => void
} & PropsWithChildren

const ActionsDropdown = ({
  size,
  children,
  label,
  className,
  onOpenChange,
}: Props) => {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          size={size || undefined}
          variant="outline"
          className={cn([
            `flex group items-center justify-center cursor-pointer w-9 h-9 p-2`,
            className,
          ])}
        >
          <EllipsisIcon className="group-hover:text-primary" />
          {label ? label : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionsDropdown

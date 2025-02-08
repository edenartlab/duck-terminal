import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type ToggleButtonProps = {
  value: string
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

const ToggleButton = ({
  value,
  label,
  onClick,
  className,
  disabled,
}: ToggleButtonProps) => {
  return (
    <ToggleGroupItem
      value={value}
      aria-label={`Set ${label}`}
      title={!disabled ? `Set ${label}` : undefined}
      onClick={!disabled ? onClick : undefined}
      className={cn([
        'flex items-center h-7 w-12 text-xs rounded-md justify-center px-2',
        disabled
          ? 'cursor-auto !bg-secondary-foreground/10 h-8 !text-popover-foreground/75 border-opacity-30 border border-popover-foreground'
          : 'bg-popover text-muted-foreground hover:!bg-accent first:rounded-r-none last:rounded-l-none hover:!text-primary',
        className,
      ])}
    >
      {label}
    </ToggleGroupItem>
  )
}

export default ToggleButton

import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'

type Props = {
  count?: number
  isActive: boolean
  onChange: () => void
}

const LikeButton = ({ count, isActive, onChange }: Props) => {
  return (
    <div
      onClick={onChange}
      className="flex gap-1 items-center justify-end cursor-pointer group h-8 min-w-8"
      title="Like"
    >
      {count !== undefined ? (
        <span className="text-xs group-hover:text-primary">{count}</span>
      ) : null}
      <HeartIcon
        size={16}
        className={cn(
          'group-hover:text-primary',
          isActive ? 'fill-current' : undefined,
        )}
      />
    </div>
  )
}

export default LikeButton

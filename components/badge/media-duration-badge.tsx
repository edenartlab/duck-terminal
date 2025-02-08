import LoadingIndicator from '@/components/loading-indicator'
import { formatDuration } from '@/lib/strings'
import { PlayIcon } from 'lucide-react'

type Props = {
  isLoading?: boolean
  duration?: number
}

export const MediaDurationBadge = ({ isLoading, duration }: Props) => {
  return (
    <div className="absolute inset-0 rounded-full h-8 flex justify-center items-center pointer-events-none">
      <div className="text-xs text-popover-foreground bg-opacity-70 text-opacity-85 flex items-center bg-popover px-2 py-1 rounded-xl">
        {isLoading ? (
          <LoadingIndicator className="mr-1 h-3 w-3" />
        ) : (
          <PlayIcon className="mr-1 h-3 w-3" />
        )}
        <div>{duration ? formatDuration(duration) : '0:00'}</div>
      </div>
    </div>
  )
}

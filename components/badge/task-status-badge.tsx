import LoadingIndicator from '@/components/loading-indicator'
import { cn } from '@/lib/utils'
import { TaskV2Status, ToolOutputTypeV2 } from '@edenlabs/eden-sdk'
import { BanIcon, HourglassIcon, TriangleAlertIcon } from 'lucide-react'

type Props = {
  output_type?: ToolOutputTypeV2
  status: TaskV2Status
  hideText?: boolean
}
const TaskStatusBadge = ({ output_type, status, hideText }: Props) => {
  return (
    <div className="flex items-center gap-2">
      {status === 'pending' ? <HourglassIcon className="h-4 w-4" /> : null}
      {status === 'running' ? (
        <LoadingIndicator
          className={cn([
            'h-6 w-6 opacity-75',
            output_type === 'video'
              ? 'text-green-400'
              : output_type === 'image'
              ? 'text-purple-600'
              : 'text-blue-600',
          ])}
        />
      ) : null}
      {status === 'cancelled' ? (
        <BanIcon className="h-4 w-4 text-warning" />
      ) : null}
      {status === 'failed' ? (
        <TriangleAlertIcon className="h-4 w-4 text-destructive" />
      ) : null}
      <span
        className={cn([
          'capitalize text-sm',
          hideText ? 'sr-only' : undefined,
          status === 'failed' ? 'text-destructive' : '',
          status === 'cancelled' ? 'text-warning' : '',
        ])}
      >
        {status}
      </span>
    </div>
  )
}

export default TaskStatusBadge

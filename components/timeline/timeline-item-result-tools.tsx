import CreationActionsMenu from '@/components/button/creations-actions-menu'
import ModelActionsMenu from '@/components/button/model-actions-menu'
import TaskActionsMenu from '@/components/button/task-actions-menu'
import PrivacyToggle from '@/features/detail/privacy-toggle'
import { cn } from '@/lib/utils'
import { TaskV2, TaskV2Result, TasksV2ResultOutput } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import React, { Suspense } from 'react'

type Props = {
  task: TaskV2
  result: TaskV2Result
  index: number
  output: TasksV2ResultOutput
  queryKey: QueryKey
  className?: string
}

const TimelineItemResultTools = ({
  task,
  result,
  index,
  output,
  queryKey,
  className,
}: Props) => {
  return (
    <div
      data-test-id="timeline-item-result-tools"
      className={cn([`relative text-sm mt-2`, className])}
    >
      <div className="flex flex-wrap gap-2">
        {output.model ? (
          <PrivacyToggle
            queryKey={queryKey}
            type={'model'}
            item={output.model}
          />
        ) : null}
        {output.creation ? (
          <PrivacyToggle
            queryKey={queryKey}
            type={'creation'}
            item={output.creation}
          />
        ) : null}
        <Suspense>
          {task.output_type === 'lora' && output.model ? (
            <ModelActionsMenu
              model={output.model}
              className="ml-auto"
              queryKey={queryKey}
            />
          ) : output.creation ? (
            <CreationActionsMenu
              creation={output.creation}
              className="ml-auto"
              queryKey={queryKey}
            />
          ) : (
            <TaskActionsMenu
              task={task}
              result={result}
              index={index}
              output={output}
              className="ml-auto"
              // queryKey={queryKey}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default TimelineItemResultTools

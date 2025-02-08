'use client'

import AlertDestructive from '@/components/alert/alert-destructive'
import TextClampMore from '@/components/text/text-clamp-more'
import ParameterTable from '@/components/timeline/parameter-table'
import { AlertDescription } from '@/components/ui/alert'
import { TooltipIconButton } from '@/components/ui/assistant-ui/tooltip-icon-button'
import { TaskResultToolArgs } from '@/features/chat/components/tools/task-result-tool'
import { cn } from '@/lib/utils'
import { ToolCallContentPartComponent } from '@assistant-ui/react'
import { TaskV2Status } from '@edenlabs/eden-sdk'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
  WrenchIcon,
} from 'lucide-react'
import React, { useState } from 'react'

export const ToolFallback: ToolCallContentPartComponent = ({
  toolName,
  args,
  result,
}) => {
  delete args.seed
  const { status: toolStatus, error: toolError } = result as TaskResultToolArgs

  const [isCollapsed, setIsCollapsed] = useState(true)
  return (
    <div className="mt-2 mb-2 flex w-full flex-col">
      <div
        className={cn([
          'bg-muted-darker cursor-pointer py-2 flex items-center gap-2 px-4 rounded-md border',
          !isCollapsed ? 'rounded-b-none' : '',
        ])}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <WrenchIcon className="size-4" />
        <div className="flex items-center gap-2">
          <div>
            <span className="font-bold">{toolName}</span>
          </div>
          {toolStatus === null ||
          toolStatus === TaskV2Status.Running ||
          toolStatus === TaskV2Status.Pending ? (
            <span
              className={'text-blue-500 mr-1 h-5 w-5 loading loading-ring'}
            />
          ) : null}
          {toolStatus === TaskV2Status.Failed ? (
            <TriangleAlertIcon className="text-red-500 h-5 w-5" />
          ) : null}
          {toolStatus === TaskV2Status.Completed ? (
            <CircleCheckIcon className="text-green-500 h-5 w-5" />
          ) : null}
        </div>
        <div className="flex-grow" />
        <TooltipIconButton tooltip={isCollapsed ? 'Expand' : 'Collapse'}>
          {!isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </TooltipIconButton>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-2 py-2 border border-t-0 rounded-md rounded-tr-none rounded-tl-none bg-popover/30">
          <ParameterTable args={args} hideHeader={true} />
        </div>
      )}
      {toolStatus === TaskV2Status.Failed ? (
        <div className="mt-2">
          <AlertDestructive title="Tool Call failed">
            <AlertDescription>
              <TextClampMore text={toolError || 'Unknown Error'} lines={3} />
            </AlertDescription>
          </AlertDestructive>
        </div>
      ) : null}
    </div>
  )
}

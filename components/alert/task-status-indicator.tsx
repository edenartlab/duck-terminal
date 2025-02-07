'use client'

import AlertDestructive from '@/components/alert/alert-destructive'
import { AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthState } from '@/hooks/use-auth-state'
import customImageLoader from '@/image-loader'
import { useTaskStatus } from '@/providers/task-status-provider'
import { TaskV2Status } from '@edenlabs/eden-sdk'
import {
  BanIcon,
  CircleCheckIcon,
  ExternalLinkIcon,
  InboxIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTimeAgo } from 'next-timeago'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const TaskStatusIndicator = () => {
  const { isSignedIn } = useAuthState()
  const {
    allTasks,
    pendingRunningTasks,
    failedTasks,
    completedTasks,
    cancelledTasks,
  } = useTaskStatus()
  const [open, setOpen] = useState(false)
  const { TimeAgo } = useTimeAgo()

  if (!isSignedIn) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger title="View recent tasks" asChild>
        <Button variant="ghost" className="flex px-2 gap-2 focus:!ring-0">
          {(!pendingRunningTasks || !pendingRunningTasks.length) &&
          (!completedTasks || !completedTasks.length) ? (
            <div className="flex items-center">
              <InboxIcon className="mr-1 h-4 w-4" />0
            </div>
          ) : (
            <>
              {pendingRunningTasks && pendingRunningTasks.length ? (
                <div className="flex items-center text-blue-500">
                  <span className={'mr-1 h-5 w-5 loading loading-ring'} />
                  <span className="text-sm">{pendingRunningTasks.length}</span>
                </div>
              ) : null}
              {completedTasks && completedTasks.length ? (
                <div className="flex items-center text-green-500">
                  <CircleCheckIcon className="mr-1 h-4 w-4" />
                  <span className="text-sm">{completedTasks.length}</span>
                </div>
              ) : null}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-popover shadow-md rounded-md w-80">
        <DropdownMenuItem className="cursor-pointer group" asChild>
          <Link
            href={'/create/image/flux_schnell'}
            prefetch={false}
            className="text-sm px-2 py-1"
          >
            <div className="flex w-full justify-between items-center gap-2">
              <div className=" flex gap-1 items-center">
                <div className="group-hover:underline">View all Tasks</div>
                <ExternalLinkIcon className="ml-1 h-4 w-4" />
              </div>
              <div className="px-2 py-1">
                <div className="flex space-x-2 justify-between">
                  {pendingRunningTasks && pendingRunningTasks.length ? (
                    <div className="flex text-blue-500 items-center">
                      <span className={'mr-1.5 h-4 w-4 loading loading-ring'} />
                      <span className="text-xs">
                        {pendingRunningTasks.length}
                      </span>
                    </div>
                  ) : null}
                  {completedTasks && completedTasks.length ? (
                    <div className="flex text-green-500 items-center">
                      <CircleCheckIcon className="mr-1.5 h-4 w-4" />
                      <span className="text-xs">{completedTasks.length}</span>
                    </div>
                  ) : null}
                  {failedTasks && failedTasks.length ? (
                    <div className="flex text-red-500 items-center">
                      <TriangleAlertIcon className="mr-1.5 h-4 w-4" />
                      <span className="text-xs">{failedTasks.length}</span>
                    </div>
                  ) : null}
                  {cancelledTasks && cancelledTasks.length ? (
                    <div className="flex text-yellow-500 items-center">
                      <BanIcon className="mr-1.5 h-4 w-4" />
                      <span className="text-xs">{cancelledTasks.length}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100dvh_-_240px)] md:max-h-[calc(100dvh_-_120px)]">
          {allTasks.length === 0 ? (
            <DropdownMenuItem className="px-2 py-3 bg-muted/20 text-muted-foreground/50 hover:bg-muted rounded cursor-pointer">
              No recent tasks
            </DropdownMenuItem>
          ) : (
            allTasks.map(task => (
              <div key={task._id}>
                <DropdownMenuItem
                  className="px-2 py-2 hover:bg-muted rounded cursor-pointer"
                  asChild
                >
                  <Link
                    href={`/create/${task.output_type}/${task.tool}`}
                    prefetch={false}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2 mb-1">
                        {task.status === null ||
                        task.status === TaskV2Status.Running ||
                        task.status === TaskV2Status.Pending ? (
                          <span
                            className={
                              'text-blue-500 mr-1 h-5 w-5 loading loading-ring'
                            }
                          />
                        ) : null}
                        {task.status === TaskV2Status.Completed ? (
                          <CircleCheckIcon className="text-green-500 h-4 w-4" />
                        ) : null}
                        {task.status === TaskV2Status.Cancelled ? (
                          <BanIcon className="text-yellow-500 h-4 w-4" />
                        ) : null}
                        {task.status === TaskV2Status.Failed ? (
                          <TriangleAlertIcon className="text-red-500 h-4 w-4" />
                        ) : null}
                        <div className="text-xs text-accent-foreground">
                          {task.tool || 'No tool'}
                        </div>
                        <div
                          className="text-xs text-muted-foreground/50 ml-auto"
                          title={new Date(task.createdAt).toLocaleString()}
                        >
                          <TimeAgo date={task.createdAt} locale="en-short" />
                        </div>
                      </div>
                      <div className={'h-10 flex gap-2 items-center'}>
                        {task.status === TaskV2Status.Completed
                          ? task.result.map((result, resultIndex) =>
                              result.output && Array.isArray(result.output) ? (
                                result.output.map((output, index) => (
                                  <Image
                                    key={`${task._id}_${index}_${output.filename}`}
                                    className="flex-shrink-0 max-h-8 w-8 rounded-md object-cover"
                                    loader={customImageLoader}
                                    src={output.filename || ''}
                                    alt={task.args.prompt || ''}
                                    width={48}
                                    height={48}
                                  />
                                ))
                              ) : (
                                <AlertDestructive
                                  key={resultIndex}
                                  title="Data Error"
                                >
                                  <AlertDescription>
                                    Item: {task?._id}
                                  </AlertDescription>
                                </AlertDestructive>
                              ),
                            )
                          : null}
                        <div className="text-xs line-clamp-2 text-muted-foreground">
                          {task.args?.prompt || '-'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TaskStatusIndicator

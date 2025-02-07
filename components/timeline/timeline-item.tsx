import AlertDestructive from '@/components/alert/alert-destructive'
import TaskStatusBadge from '@/components/badge/task-status-badge'
import TaskActionsMenu from '@/components/button/task-actions-menu'
import ErrorBoundary from '@/components/error-boundary'
import { LightboxGallery } from '@/components/media/lightbox'
import ParameterTableCollapsible from '@/components/timeline/parameter-table-collapsible'
import TimelineItemMediaResult from '@/components/timeline/timeline-item-media-result'
import TimelineItemModelResult from '@/components/timeline/timeline-item-model-result'
import { AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuthState } from '@/hooks/use-auth-state'
import { cn } from '@/lib/utils'
import { TaskV2, TaskV2Status } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { Suspense, useCallback, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  item: TaskV2
  queryKey: QueryKey
}

const TimelineItem = ({ item, queryKey }: Props) => {
  const { verifyAuth } = useAuthState()

  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = useCallback(async (taskId: TaskV2['_id']) => {
    if (!(await verifyAuth())) {
      return
    }

    setIsCancelling(true)

    try {
      const response = await axios.post('/api/tasks/cancel', {
        taskId,
      })

      toast.info(`Task cancelled`, {
        description: (
          <code className=" text-xs text-foreground">
            taskId: {taskId} | status: {response.data.status}
          </code>
        ),
        dismissible: true,
        richColors: true,
      })
    } catch (err) {
      console.log(err)
      const errorMessage = axios.isAxiosError(err)
        ? JSON.parse((err as AxiosError).request.responseText)?.message
        : 'Unknown Error'
      toast.error(`Failed to cancel task`, {
        description: JSON.stringify(errorMessage),
        dismissible: true,
        richColors: true,
      })
    } finally {
      setIsCancelling(false)
    }
  }, [])

  const num_samples = (item.args.n_samples ?? item.args.num_outputs) || false

  return (
    <div
      data-test-id="timeline-item"
      key={item._id}
      className={cn([`border border-secondary p-2 rounded-lg overflow-hidden`])}
    >
      <ParameterTableCollapsible item={item} />
      <div className="flex items-center justify-center h-full w-full flex-grow">
        <div
          className={cn([
            'grid gap-2 auto-cols-fr',
            !num_samples || num_samples === 1
              ? 'grid-flow-col grid-cols-1'
              : num_samples > 2
              ? (item.args.width ?? 1024) > (item.args.height ?? 1024)
                ? 'grid-cols-2 grid-rows-2 md:grid-cols-2 md:grid-rows-2 justify-items-center'
                : 'grid-flow-col auto-cols-[minmax(0,_1fr)] grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 justify-items-center'
              : 'grid-cols-2 justify-items-center',
            num_samples === 3
              ? 'md:!grid-cols-3 xl:!grid-cols-3 md:!grid-rows-1'
              : '',
            item.output_type === 'lora' ? 'flex flex-col gap-0' : '',
          ])}
        >
          {item.status !== TaskV2Status.Completed ? (
            <>
              {item.status === 'failed' ? (
                <div className="h-full w-full p-2 bg-accent">
                  <TaskStatusBadge status={item.status} />
                  <div className="mt-1 text-muted-foreground text-sm line-clamp-3">
                    {item.error}
                  </div>
                </div>
              ) : null}

              {item.status === 'cancelled' ? (
                <div className="h-full w-full p-2 bg-accent">
                  <TaskStatusBadge status={item.status} />
                </div>
              ) : null}
            </>
          ) : null}

          {item.status === 'pending' || item.status === 'running' ? (
            <>
              {[
                ...Array(
                  (num_samples || 1) -
                    (item.result && Array.isArray(item.result)
                      ? item.result.length
                      : 0),
                ),
              ].map((_e, i) => (
                <div
                  key={i}
                  className={cn([
                    'relative p-2 bg-secondary rounded-md overflow-hidden', // flex flex-col items-center overflow-hidden max-h-[50dvh]
                    'max-w-full',
                  ])}
                  style={{
                    aspectRatio:
                      (item.args.width ?? 1024) / (item.args.height ?? 1024) ||
                      (item.output_type === 'audio' ? 3 : 1),
                  }}
                >
                  <div
                    className={cn([
                      'max-h-[calc(60vh_-_72.4px)]',
                      (item.args.width ?? 1024) / (item.args.height ?? 1024) ||
                      ((item.output_type === 'audio' ? 3 : 1) < 1 &&
                        (num_samples || 1) === 1)
                        ? 'h-[calc(60dvh_-_72.4px)] max-h-full flex justify-center max-w-full'
                        : (item.args.width ?? 1024) /
                            (item.args.height ?? 1024) >
                            1 && (num_samples || 1) === 1
                        ? 'w-[calc(60vh_-_72.4px)] max-h-full max-w-full'
                        : '',
                    ])}
                  >
                    <div
                      className="relative bg-accent z-10 rounded-md max-w-full max-h-full"
                      style={{
                        aspectRatio:
                          (item.args.width ?? 1024) /
                            (item.args.height ?? 1024) ||
                          (item.output_type === 'audio' ? 3 : 1),
                        height:
                          (item.args.width ?? 1024) /
                            (item.args.height ?? 1024) <
                          1
                            ? '-webkit-fill-available'
                            : undefined,
                      }}
                    >
                      <div className="absolute flex flex-col md:flex-row items-center justify-center gap-2 inset-0 text-center self-center text-sm text-muted-foreground animate-pulse">
                        <TaskStatusBadge
                          status={item.status}
                          hideText={true}
                          output_type={item.output_type}
                        />
                        {item.status === 'pending'
                          ? 'Waiting to start...'
                          : `Generating ${item.output_type}... `}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}

          <Suspense>
            <ErrorBoundary>
              <LightboxGallery>
                {item.result && Array.isArray(item.result) && item.result.length
                  ? item.result.map((result, index) =>
                      result.output && Array.isArray(result.output) ? (
                        result.output.map((output, outputIndex) =>
                          output.model === undefined ? (
                            <TimelineItemMediaResult
                              queryKey={queryKey}
                              key={`${item._id}_${index}_${outputIndex}`}
                              index={index}
                              task={item}
                              result={result}
                            />
                          ) : (
                            // api populates a model property with full model document
                            <TimelineItemModelResult
                              queryKey={queryKey}
                              key={`${item._id}_${index}_${outputIndex}`}
                              index={index}
                              result={result}
                              task={item}
                            />
                          ),
                        )
                      ) : (
                        <AlertDestructive key={index} title="Data Error">
                          <AlertDescription>Item: {item?._id}</AlertDescription>
                        </AlertDestructive>
                      ),
                    )
                  : null}
              </LightboxGallery>
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>

      {item.status !== TaskV2Status.Completed ? (
        <div className="flex justify-between items-center mt-2 h-9">
          {item.status === TaskV2Status.Pending ||
          item.status === TaskV2Status.Running ? (
            <Button
              variant="outline"
              type="button"
              className="px-2 py-0 h-6 text-warning/40 text-xs bg-popover/40 hover:bg-popover/70"
              onClick={() => handleCancel(item._id)}
              disabled={isCancelling}
            >
              Cancel Task
            </Button>
          ) : null}
          <TaskActionsMenu task={item} className="ml-auto" />
        </div>
      ) : null}
    </div>
  )
}
export default TimelineItem

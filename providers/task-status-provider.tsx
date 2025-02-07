'use client'

import { useTaskListQuery } from '@/hooks/query/use-task-list-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { useWebSocketContext } from '@/providers/websocket-provider'
import { TaskV2, TaskV2Status } from '@edenlabs/eden-sdk'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
// Add notification callback for external components
import { useCallback } from 'react'

export type TaskUpdateCallback = (taskUpdate: TaskV2) => void

type TaskStatusContextType = {
  allTasks: TaskV2[]
  pendingRunningTasks: TaskV2[]
  failedTasks: TaskV2[]
  completedTasks: TaskV2[]
  cancelledTasks: TaskV2[]
  subscribeToTaskUpdates: (callback: TaskUpdateCallback) => void
}

const TaskStatusContext = createContext<TaskStatusContextType>({
  allTasks: [],
  pendingRunningTasks: [],
  failedTasks: [],
  completedTasks: [],
  cancelledTasks: [],
  subscribeToTaskUpdates: () => {},
})

export const useTaskStatus = () => useContext(TaskStatusContext)

type Props = {
  children: React.ReactNode
}

export const TaskStatusProvider = ({ children }: Props) => {
  const { isSignedIn } = useAuthState()
  const { lastMessageJson } = useWebSocketContext()
  const [allTasks, setAllTasks] = useState<TaskV2[]>([])
  const taskUpdateSubscribers = useMemo(() => new Set<TaskUpdateCallback>(), [])

  // Function to subscribe to task updates
  const subscribeToTaskUpdates = useCallback(
    (callback: TaskUpdateCallback) => {
      taskUpdateSubscribers.add(callback)
      return () => taskUpdateSubscribers.delete(callback)
    },
    [taskUpdateSubscribers],
  )

  const queryResponse = useTaskListQuery({ enabled: !!isSignedIn })

  // console.log({ queryResponse })
  useEffect(() => {
    setAllTasks(queryResponse.tasks || [])
  }, [queryResponse.tasks])
  // // Fetch initial tasks on mount
  // useEffect(() => {
  //   const fetchInitialTasks = async () => {
  //     try {
  //       const response = await fetch('/api/tasks/list')
  //       const data: TasksV2ListResponse = await response.json()
  //       setAllTasks(data.docs || [])
  //     } catch (error) {
  //       console.error('Error fetching initial tasks:', error)
  //     }
  //   }
  //
  //   fetchInitialTasks()
  // }, [])

  // Handle WebSocket messages to update tasks
  useEffect(() => {
    if (!lastMessageJson) return

    const { event, data } = lastMessageJson

    if (event === 'task-update' && data?.task) {
      const taskUpdate = data.task as TaskV2
      // Update allTasks ensuring uniqueness
      setAllTasks(prev => {
        const existingTaskIndex = prev.findIndex(t => t._id === taskUpdate._id)
        if (existingTaskIndex === -1) {
          return [taskUpdate, ...prev] // Prepend the new task
        } else {
          const updatedTasks = [...prev]
          updatedTasks[existingTaskIndex] = taskUpdate
          return updatedTasks
        }
      })

      // Notify subscribers of the task update
      taskUpdateSubscribers.forEach(callback => callback(taskUpdate))
    }
  }, [lastMessageJson, taskUpdateSubscribers])

  // Categorize tasks based on their status
  const pendingRunningTasks = useMemo(() => {
    return allTasks.filter(
      task =>
        task.status === null ||
        task.status === TaskV2Status.Pending ||
        task.status === TaskV2Status.Running,
    )
  }, [allTasks])

  const failedTasks = useMemo(() => {
    return allTasks.filter(task => task.status === TaskV2Status.Failed)
  }, [allTasks])

  const completedTasks = useMemo(() => {
    return allTasks.filter(task => task.status === TaskV2Status.Completed)
  }, [allTasks])

  const cancelledTasks = useMemo(() => {
    return allTasks.filter(task => task.status === TaskV2Status.Cancelled)
  }, [allTasks])

  // Memoize context value to optimize performance
  const contextValue = useMemo(
    () => ({
      allTasks,
      pendingRunningTasks,
      failedTasks,
      completedTasks,
      cancelledTasks,
      subscribeToTaskUpdates,
    }),
    [
      allTasks,
      pendingRunningTasks,
      failedTasks,
      completedTasks,
      cancelledTasks,
      subscribeToTaskUpdates,
    ],
  )

  return (
    <TaskStatusContext.Provider value={contextValue}>
      {children}
    </TaskStatusContext.Provider>
  )
}

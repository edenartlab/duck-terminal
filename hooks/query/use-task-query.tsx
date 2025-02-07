import { fetcher } from '@/lib/fetcher'
import { TaskV2, TasksV2GetResponse } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: TaskV2['_id']
  initialData?: TasksV2GetResponse
  staleTime?: number
  enabled?: boolean
}

export const useTaskQuery = ({
  key,
  initialData,
  staleTime,
  enabled = true,
}: Props) => {
  const queryKey = ['tasks', key]

  const {
    data,
    error,
    isError,
    isPending,
    isLoading,
    isLoadingError,
    isRefetchError,
    isSuccess,
    status,
  } = useQuery({
    enabled,
    initialData,
    queryKey,
    queryFn: () => fetcher<TasksV2GetResponse>(`/api/tasks/${key}`),
    staleTime,
  })

  // console.log({ data })

  const queryClient = useQueryClient()

  return {
    task: data?.task as TaskV2 | undefined,
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    queryKey,
    error,
    isError,
    isPending,
    isLoading,
    isLoadingError,
    isRefetchError,
    isSuccess,
    status,
  }
}

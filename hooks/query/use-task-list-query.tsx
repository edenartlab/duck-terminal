import { fetcher } from '@/lib/fetcher'
import { TaskV2, TasksV2ListResponse } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  enabled?: boolean
}

export const useTaskListQuery = ({ enabled = true }: Props) => {
  const queryKey = ['tasks', 'all']

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
    queryKey,
    queryFn: () =>
      fetcher<TasksV2ListResponse>(`/api/tasks/list?limit=100&minDate=true`),
  })

  // console.log({ data })

  const queryClient = useQueryClient()

  return {
    tasks: data?.docs as TaskV2[] | undefined,
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

import { createCursorPaginationRoute, fetcher } from '@/lib/fetcher'
import { Agent, PaginatedCursorResponse } from '@edenlabs/eden-sdk'
import { useQuery } from '@tanstack/react-query'

export const listQueryKey = ['agents']

export const useAgentsListQuery = (query?: { _id?: string[] }) => {
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
    queryKey: [...listQueryKey, query?._id],
    queryFn: () => {
      const paginationRoute = createCursorPaginationRoute('/api/feed/agents', {
        ...query,
        // cursor: pageParam || '',
        limit: 4,
      })

      // console.log({paginationRoute})
      return fetcher<PaginatedCursorResponse<Agent>>(paginationRoute)
    },
  })

  return {
    agents: data?.docs ?? undefined,
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

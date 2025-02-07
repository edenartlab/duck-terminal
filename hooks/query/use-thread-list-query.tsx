'use client'

import { fetcher } from '@/lib/fetcher'
import { Thread, ThreadsListResponse } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  agentId?: string
  enabled?: boolean
}

export const useThreadListQuery = (props?: Props) => {
  const queryKey = ['threads', 'list']

  const { agentId, enabled } = props || {}
  if (agentId) {
    queryKey.push(agentId)
  }

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
    queryKey,
    enabled: enabled !== undefined ? enabled : undefined,
    queryFn: () =>
      fetcher<ThreadsListResponse>(
        `/api/threads/list?limit=50${agentId ? `&agentId=${agentId}` : ''}`,
      ),
  })

  // console.log({ data })

  const queryClient = useQueryClient()

  return {
    threads: data?.docs as Thread[] | undefined,
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

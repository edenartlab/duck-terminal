import { fetcher } from '@/lib/fetcher'
import { Agent, AgentGetResponse } from '@edenlabs/eden-sdk'
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: Agent['_id']
  initialData?: AgentGetResponse
  enabled?: boolean
}

export const useAgentQuery = ({ key, initialData, enabled = true }: Props) => {
  const queryKey: QueryKey = ['agents', key]

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
    queryFn: () => fetcher<AgentGetResponse>(`/api/agents/${key}`),
  })

  const queryClient = useQueryClient()

  return {
    agent: data?.agent as Agent | undefined,
    queryKey,
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
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

import { fetcher } from '@/lib/fetcher'
import { ApiKey } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useApiKeysQuery = () => {
  const queryKey = ['api-keys']

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
    queryFn: () =>
      fetcher<{
        apiKeys: ApiKey[]
      }>(`/api/apikeys`),
  })

  const queryClient = useQueryClient()

  return {
    apiKeys: (data?.apiKeys as ApiKey[]) || [],
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

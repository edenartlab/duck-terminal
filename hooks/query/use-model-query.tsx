import { fetcher } from '@/lib/fetcher'
import { ModelV2, ModelsV2GetResponse } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: ModelV2['_id']
  initialData?: ModelsV2GetResponse
  enabled?: boolean
  retry?: number | boolean
}

export const useModelQuery = ({
  key,
  initialData,
  enabled = true,
  retry,
}: Props) => {
  const queryKey = ['models', key]

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
    queryFn: () => fetcher<ModelsV2GetResponse>(`/api/models/${key}`),
    retry,
  })

  const queryClient = useQueryClient()

  return {
    model: data?.model as ModelV2 | undefined,
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

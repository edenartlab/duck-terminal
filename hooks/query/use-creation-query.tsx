import { fetcher } from '@/lib/fetcher'
import { CreationV2, CreationsV2GetResponse } from '@edenlabs/eden-sdk'
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: CreationV2['_id']
  initialData?: CreationsV2GetResponse
  enabled?: boolean
}

export const useCreationQuery = ({
  key,
  initialData,
  enabled = true,
}: Props) => {
  const queryKey: QueryKey = ['creations', key]

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
    queryFn: () => fetcher<CreationsV2GetResponse>(`/api/creations/${key}`),
  })

  const queryClient = useQueryClient()

  return {
    creation: data?.creation as CreationV2 | undefined,
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

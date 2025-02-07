import { fetcher } from '@/lib/fetcher'
import { CollectionV2, CollectionsV2GetResponse } from '@edenlabs/eden-sdk'
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: CollectionV2['_id']
  initialData?: CollectionsV2GetResponse
  enabled?: boolean
}

export const useCollectionQuery = ({
  key,
  initialData,
  enabled = true,
}: Props) => {
  const queryKey: QueryKey = ['collections', key]

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
    queryFn: () => fetcher<CollectionsV2GetResponse>(`/api/collections/${key}`),
  })

  const queryClient = useQueryClient()

  return {
    collection: data?.collection as CollectionV2 | undefined,
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

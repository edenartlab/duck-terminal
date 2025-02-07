'use client'

import { fetcher } from '@/lib/fetcher'
import { CollectionsV2GetLightResponse } from '@edenlabs/eden-sdk'
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCollectionsLight = ({ enabled }: { enabled: boolean }) => {
  const queryKey: QueryKey = ['collections', 'me', 'light']

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
      fetcher<CollectionsV2GetLightResponse>(`/api/collections/light`),
  })

  const queryClient = useQueryClient()

  return {
    collections:
      data?.collections as CollectionsV2GetLightResponse['collections'],
    queryKey,
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    refetch: () => queryClient.refetchQueries({ queryKey }),
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

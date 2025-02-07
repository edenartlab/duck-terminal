import { fetcher } from '@/lib/fetcher'
import { Creator, CreatorsGetResponse } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: Creator['username']
  initialData?: CreatorsGetResponse
  enabled?: boolean
}

export const useCreatorQuery = ({
  key,
  initialData,
  enabled = true,
}: Props) => {
  const queryKey = ['creators', key]

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
    queryFn: () => fetcher<CreatorsGetResponse>(`/api/users/${key}`),
  })

  const queryClient = useQueryClient()

  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    queryKey,
    creator: data?.creator as Creator | undefined,
    balance: data?.balance || undefined,
    foreverBalance: data?.foreverBalance || undefined,
    subscriptionBalance: data?.subscriptionBalance || undefined,
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

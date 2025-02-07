import { fetcher } from '@/lib/fetcher'
import { PaymentsProductsResponse } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  enabled?: boolean
}

export const useProductsQuery = ({ enabled = true }: Props) => {
  const queryKey = ['products']

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
    queryFn: () => fetcher<PaymentsProductsResponse>(`/api/products`),
  })

  const queryClient = useQueryClient()

  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    products: data?.products || undefined,
    subscriptions: data?.subscriptions || undefined,
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

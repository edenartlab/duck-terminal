import { fetcher } from '@/lib/fetcher'
import { ToolV2, ToolsGetResponseV2 } from '@edenlabs/eden-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  key: ToolV2['key']
  initialData?: ToolsGetResponseV2
}

export const useToolQuery = ({ key, initialData }: Props) => {
  const queryKey = ['tools', key]

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
    staleTime: 100000,
    initialData,
    queryKey,
    queryFn: () => fetcher<ToolsGetResponseV2>(`/api/tools/${key}`),
  })

  const queryClient = useQueryClient()

  return {
    tool: data?.tool as ToolV2 | undefined,
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

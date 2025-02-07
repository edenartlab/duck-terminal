import { fetcher } from '@/lib/fetcher'
import { ToolOutputTypeV2, ToolV2 } from '@edenlabs/eden-sdk'
import { useQuery } from '@tanstack/react-query'

export const toolsListQueryKey = ['tools']

export const useToolsListQuery = (query?: {
  output_type?: ToolOutputTypeV2[]
}) => {
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
    queryKey: [...toolsListQueryKey, query?.output_type],
    queryFn: () =>
      fetcher<{
        tools: ToolV2[]
      }>(
        `/api/tools?hideParams=true${
          query?.output_type
            ? `&output_type=${query.output_type
                .map(outputType => outputType)
                .join(',')}`
            : ''
        }`,
      ),
  })

  return {
    tools: (data?.tools as ToolV2[]) ?? undefined,
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

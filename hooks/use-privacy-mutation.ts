import { fetcher } from '@/lib/fetcher'
import {
  isCreationData,
  isInfiniteData,
  isModelData,
  isTaskV2,
  isTasksV2ListResponse,
} from '@/lib/query/guards'
import { capitalize } from '@/lib/strings'
import {
  AgentsUpdateResponse,
  CollectionsV2UpdateResponse,
  CreationV2,
  CreationsV2PatchResponse,
  FeedV2CursorResponse,
  ModelV2,
  ModelsV2PatchResponse,
  TasksV2ListResponse,
} from '@edenlabs/eden-sdk'
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

// Define a union type for possible previousData types
type PreviousData =
  | InfiniteData<TasksV2ListResponse | FeedV2CursorResponse>
  | CreationV2
  | ModelV2
  | undefined

type MutationOptions = {
  type: 'creation' | 'model' | 'collection' | 'agent'
  queryKey: QueryKey
  onSuccessMessage?: string
}

export function usePrivacyMutation({
  type,
  queryKey,
  onSuccessMessage,
}: MutationOptions) {
  const queryClient = useQueryClient()

  return useMutation<
    | ModelsV2PatchResponse
    | CreationsV2PatchResponse
    | CollectionsV2UpdateResponse
    | AgentsUpdateResponse,
    Error,
    { ids: string[]; public: boolean },
    { previousData: PreviousData }
  >({
    mutationFn: async ({ ids, public: isPublic }) => {
      const endpoint =
        ids.length === 1 ? `/api/${type}s/${ids[0]}` : `/api/${type}s/bulk`

      const response = await fetcher<
        ModelsV2PatchResponse | CreationsV2PatchResponse
      >(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          ids.length === 1
            ? { public: isPublic }
            : { [`${type}Ids`]: ids, public: isPublic },
        ),
      })

      if (!response) {
        throw new Error('Empty response from server')
      }

      return response
    },
    onMutate: async ({ ids, public: isPublic }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<PreviousData>(queryKey)

      // Inside your onMutate function
      if (previousData) {
        let newData: PreviousData
        if (isInfiniteData(previousData)) {
          newData = {
            ...previousData,
            pages: previousData.pages.map(page => {
              if (isTasksV2ListResponse(page)) {
                return {
                  ...page,
                  docs: page?.docs?.map(doc => {
                    if (!isTaskV2(doc)) return doc
                    return {
                      ...doc,
                      result: doc.result.map(result => {
                        result.output = result.output.map(output => {
                          if (
                            type === 'creation' &&
                            output.creation &&
                            ids.includes(output.creation._id)
                          ) {
                            return {
                              ...output,
                              creation: {
                                ...output.creation,
                                public: isPublic,
                              },
                            }
                          }
                          if (
                            type === 'model' &&
                            output.model &&
                            ids.includes(output.model._id)
                          ) {
                            return {
                              ...output,
                              model: {
                                ...output.model,
                                public: isPublic,
                              },
                            }
                          }
                          return output
                        })
                        return result
                      }),
                    }
                  }),
                }
              }
              return page
            }),
          }
        } else {
          // Handle non-infinite data changes if applicable
          if (
            type === 'creation' &&
            isCreationData(previousData) &&
            ids.includes(previousData._id)
          ) {
            newData = {
              ...previousData,
              public: isPublic,
            }
          } else if (
            type === 'model' &&
            isModelData(previousData) &&
            ids.includes(previousData._id)
          ) {
            newData = {
              ...previousData,
              public: isPublic,
            }
          } else {
            newData = previousData
          }
        }

        queryClient.setQueryData(queryKey, newData)
      }

      return { previousData }
    },
    onError: (err, _variables, context) => {
      console.error('Mutation error:', err)
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      toast.error(`Failed to update ${type} privacy`, {
        description: 'Please try again.',
        dismissible: true,
        richColors: true,
      })
    },
    onSuccess: (
      _response: ModelsV2PatchResponse | CreationsV2PatchResponse,
      variables,
    ) => {
      const message = onSuccessMessage
        ? onSuccessMessage
        : `${capitalize(type)} updated`
      toast.success(message, {
        description: `Set to ${variables.public ? 'public' : 'private'}`,
        dismissible: true,
        richColors: true,
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey })
    },
  })
}

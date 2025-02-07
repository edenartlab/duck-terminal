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
  Agent,
  AgentsDeleteResponse,
  CollectionV2,
  CollectionsV2DeleteResponse,
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
  | CollectionV2
  | ModelV2
  | Agent
  | undefined

type MutationOptions = {
  type: 'creation' | 'model' | 'collection' | 'agent'
  queryKey: QueryKey
  onSuccessMessage?: string
}

export function useDeleteMutation({
  type,
  queryKey,
  onSuccessMessage,
}: MutationOptions) {
  const queryClient = useQueryClient()

  return useMutation<
    | ModelsV2PatchResponse
    | CreationsV2PatchResponse
    | CollectionsV2UpdateResponse,
    Error,
    { ids: string[]; deleted: boolean },
    { previousData: PreviousData }
  >({
    mutationFn: async ({ ids }) => {
      const endpoint =
        ids.length === 1 ? `/api/${type}s/${ids[0]}` : `/api/${type}s/bulk`

      const body =
        ids.length === 1
          ? { deleted: true }
          : { [`${type}Ids`]: ids, deleted: true }

      let method = 'PATCH'
      if (type === 'collection' || type === 'agent') {
        method = 'DELETE'
      }

      const response = await fetcher<
        | ModelsV2PatchResponse
        | CreationsV2PatchResponse
        | CollectionsV2DeleteResponse
        | AgentsDeleteResponse
      >(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response) {
        throw new Error('Empty response from server')
      }

      return response
    },
    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<PreviousData>(queryKey)

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
                                deleted: true,
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
                                deleted: true,
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
            newData =
              ids.reduce<CreationV2 | undefined>((acc, id) => {
                if (previousData._id === id) {
                  acc = { ...previousData, deleted: true }
                }
                return acc
              }, undefined) || previousData
          } else if (
            type === 'model' &&
            isModelData(previousData) &&
            ids.includes(previousData._id)
          ) {
            newData =
              ids.reduce<ModelV2 | undefined>((acc, id) => {
                if (previousData._id === id) {
                  acc = { ...previousData, deleted: true }
                }
                return acc
              }, undefined) || previousData
          } else {
            newData = previousData
          }
        }

        queryClient.setQueryData(queryKey, newData)
      }

      return { previousData }
    },
    onError: (err, _variables, context) => {
      console.error('Delete mutation error:', err)
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      toast.error(
        `Failed to delete ${type}${_variables.ids.length > 1 ? 's' : ''}`,
        {
          description: 'Please try again.',
          dismissible: true,
          richColors: true,
        },
      )
    },
    onSuccess: (
      _response: ModelsV2PatchResponse | CreationsV2PatchResponse,
      variables,
    ) => {
      const message = onSuccessMessage
        ? onSuccessMessage
        : `${capitalize(type)} deleted`

      const count = variables.ids.length
      const successText =
        count > 1 ? `${count} ${type}s deleted` : `${capitalize(type)} deleted`

      toast.success(message, {
        description: successText,
        dismissible: true,
        richColors: true,
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey })
    },
  })
}

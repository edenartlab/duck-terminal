import { useDeleteMutation } from '@/hooks/use-delete-mutation'
import { capitalize } from '@/lib/strings'
import { CreationV2, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'

type Props = {
  type: 'creation' | 'model'
  items: (ModelV2 | CreationV2)[]
  queryKey: QueryKey
}

export function useDeleteBulk({ type, items, queryKey }: Props) {
  const mutation = useDeleteMutation({
    type,
    queryKey,
    onSuccessMessage: `${capitalize(type)}s deleted`,
  })

  const handleDelete = async () => {
    const ids = items.map(item => item._id)
    mutation.mutate({ ids, deleted: true })
  }

  return {
    handleDelete,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

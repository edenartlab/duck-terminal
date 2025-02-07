import { usePrivacyMutation } from '@/hooks/use-privacy-mutation'
import { capitalize } from '@/lib/strings'
import { CreationV2, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'

// Props for the bulk toggle hook
type Props = {
  type: 'creation' | 'model'
  items: (ModelV2 | CreationV2)[]
  queryKey: QueryKey
}

export function usePrivacyToggleBulk({ type, items, queryKey }: Props) {
  const mutation = usePrivacyMutation({
    type,
    queryKey,
    onSuccessMessage: `${capitalize(type)}s updated`,
  })

  const handleSetPrivate = () => {
    const ids = items.map(item => item._id)
    mutation.mutate({ ids, public: false })
  }

  const handleSetPublic = () => {
    const ids = items.map(item => item._id)
    mutation.mutate({ ids, public: true })
  }

  return {
    handleSetPrivate,
    handleSetPublic,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

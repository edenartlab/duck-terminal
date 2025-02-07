import { usePrivacyMutation } from '@/hooks/use-privacy-mutation'
import { capitalize } from '@/lib/strings'
import { Agent, CollectionV2, CreationV2, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'

type TogglePrivacyProps = {
  type: 'creation' | 'model' | 'collection' | 'agent'
  item: ModelV2 | CreationV2 | CollectionV2 | Agent
  queryKey: QueryKey
}

export function usePrivacyToggle({ type, item, queryKey }: TogglePrivacyProps) {
  const mutation = usePrivacyMutation({
    type,
    queryKey,
    onSuccessMessage: `${capitalize(type)} updated`,
  })

  const handleToggle = () => {
    mutation.mutate({ ids: [item._id], public: !item.public })
  }

  return {
    handleToggle,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}

import { getThread } from '@/features/chat/chat-api'
import { Thread } from '@edenlabs/eden-sdk'
import { useQuery } from '@tanstack/react-query'

export interface ThreadResponse {
  data: Thread
  status: number
}

export function useThreadQuery({
  threadId,
  enabled = true,
}: {
  threadId?: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      if (!threadId) throw new Error('Thread ID is required')
      const response = await getThread(threadId)
      return response
    },
    enabled: enabled && !!threadId,
    staleTime: 0,
  })
}

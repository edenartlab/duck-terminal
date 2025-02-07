'use client'

import {
  JsonMessage,
  useWebSocketContext,
} from '@/providers/websocket-provider'
import { useEffect, useState } from 'react'

interface UseWebSocketMessageOptions {
  eventType: string
  abortSignal?: AbortSignal
}

export const useWebSocketMessage = ({
  eventType,
  abortSignal,
}: UseWebSocketMessageOptions) => {
  const { lastMessageJson, readyState } = useWebSocketContext()
  const [message, setMessage] = useState<JsonMessage | null>(null)

  useEffect(() => {
    if (abortSignal?.aborted) return

    if (lastMessageJson?.event === eventType) {
      setMessage(lastMessageJson)
    }
  }, [lastMessageJson, eventType, abortSignal])

  return {
    message,
    readyState,
  }
}

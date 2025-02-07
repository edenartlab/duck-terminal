import { useCallback, useState } from 'react'
import { useEdenDuck } from '@/features/chat/hooks/useEdenDuck'

export const useEdenMessages = <TMessage extends { id: string }>({
  stream,
}: {
  stream: (
    messages: TMessage[],
    callback?: (thread_id?: string) => Promise<void>,
  ) => Promise<AsyncGenerator<{ data: TMessage }>>
}) => {
  const [messages, setMessages] = useState<TMessage[]>([])
  const { onWithdrawHandle } = useEdenDuck()

  const addOrUpdateMessage = useCallback((message: TMessage) => {
    setMessages(currentMessages => {
      const index = currentMessages.findIndex(m => m.id === message.id)

      if (index !== -1) {
        // Update existing message
        const updatedMessages = [...currentMessages]
        updatedMessages[index] = message
        return updatedMessages
      }

      // Find and update all running messages
      const updatedMessages = currentMessages.map(m =>
        //@ts-expect-error status not typed on generic
        m.status?.type === 'running' &&
        //@ts-expect-error status not typed on generic
        (!m.reply_to ? message.status?.type !== 'running' : true)
          ? { ...m, status: { type: 'complete', reason: 'stop' } }
          : m,
      )

      // Add new message
      return [...updatedMessages, message]
    })
  }, [])

  const sendMessage = useCallback(
    async (newMessages: TMessage[], callback?: () => Promise<void>) => {
      // console.log('sendMessage', newMessages)
      // Add new messages optimistically
      newMessages.forEach(message => addOrUpdateMessage(message))

      const response = await stream(newMessages, callback)
      await onWithdrawHandle()

      for await (const message of response) {
        console.log('addOrUpdateMessage', message)
        addOrUpdateMessage(message.data)
      }
    },
    [addOrUpdateMessage, stream],
  )

  return {
    messages,
    sendMessage,
    setMessages,
    addOrUpdateMessage,
  }
}

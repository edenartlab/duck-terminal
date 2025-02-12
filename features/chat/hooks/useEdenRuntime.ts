import EdenFeedbackAdapter from '@/features/chat/eden-feedback-adapter'
import edenImageAttachmentAdapter from '@/features/chat/eden-image-attachment-adapter'
import {
  EdenMessage,
  edenMessageConverter,
} from '@/features/chat/eden-message-converter'
import { useEdenMessages } from '@/features/chat/hooks/useEdenMessages'
import { useThreadListQuery } from '@/hooks/query/use-thread-list-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { useAuth } from '@/contexts/auth-context'
import {
  CompositeAttachmentAdapter,
  TextContentPart,
  useExternalMessageConverter,
  useExternalStoreRuntime,
  useThread,
} from '@assistant-ui/react'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const symbolEdenExtras = Symbol('eden-extras')

export type EdenExtras = {
  [symbolEdenExtras]: true
  threadTitle: string
}

export const useEdenRuntime = ({
  agentId,
  threadId,
  stream,
  onSwitchToNewThread,
  onSwitchToThread,
  onRename,
}: {
  agentId?: string
  threadId?: string
  stream: (
    messages: EdenMessage[],
    callback?: (thread_id?: string) => Promise<void>,
  ) => Promise<AsyncGenerator<{ data: EdenMessage }>>
  onSwitchToNewThread?: () => Promise<void> | void
  onSwitchToThread?: (threadId: string) => Promise<{ messages: EdenMessage[] }>
  onRename?: (threadId: string, newTitle: string) => Promise<void>
}) => {
  // const [threadTitle, setThreadTitle] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const { isSignedIn } = useAuthState()
  const { messages, sendMessage, setMessages, addOrUpdateMessage } =
    useEdenMessages({ stream })
  const { threads, invalidate } = useThreadListQuery({
    agentId,
    enabled: isSignedIn,
  })

  // Add mounted ref to prevent state updates after unmount
  const isMounted = useRef(true)
  

  useEffect(() => {
    console.log('useEdenRuntime mounted')
    return () => {
      console.log('useEdenRuntime unmounting')
      isMounted.current = false
    }
  }, [])

  const { balance } = useAuth()

  const handleSendMessage = async (
    messages: EdenMessage[],
    callback?: (thread_id?: string) => Promise<void>,
  ) => {
    if (balance < 1) {
      console.log('Insufficient balance')
      alert('Insufficient balance. Please top up your account.');
      return
    }
    try {
      console.log('handleSendMessage start')
      setIsRunning(true)
      await sendMessage(messages, callback)
      console.log('handleSendMessage complete')
    } catch (error) {
      console.error('Error streaming messages:', error)
    } finally {
      console.log('handleSendMessage cleanup, isMounted:', isMounted.current)
      if (isMounted.current) {
        setIsRunning(false)
      } else {
        console.warn('Prevented setState after unmount in handleSendMessage')
      }
    }
  }

  const threadMessages = useExternalMessageConverter({
    callback: edenMessageConverter,
    messages,
    isRunning,
  })

  return {
    addOrUpdateMessage,
    setMessages,
    setIsRunning,
    runtime: useExternalStoreRuntime({
      isRunning,
      //@todo: fix this type issue
      //@ts-expect-error: Type error: Type 'ThreadMessage[]' is not assignable to type 'EdenMessage[]'
      messages: threadMessages,
      setMessages,
      adapters: {
        feedback: EdenFeedbackAdapter,
        attachments: new CompositeAttachmentAdapter([
          edenImageAttachmentAdapter,
        ]),
        threadList: {
          threadId,
          threads: threads?.map(thread => ({
            threadId: thread._id,
            title: thread.title,
            state: 'regular',
            status: 'regular', // Change status from 'active' to 'regular'
          })),
          onSwitchToNewThread: !onSwitchToNewThread
            ? undefined
            : async () => {
                await onSwitchToNewThread()
                setMessages([])
              },
          onSwitchToThread: !onSwitchToThread
            ? undefined
            : async threadId => {
                const { messages } = await onSwitchToThread(threadId)
                setMessages(messages)
              },
          onRename: !onRename
            ? undefined
            : async (threadId, newTitle) => {
                await onRename(threadId, newTitle)
                // update optimistically or trigger thread list query invalidation
              },
        },
      },
      onNew: async msg => {
        return handleSendMessage(
          [
            {
              id: uuidv4(),
              role: 'user',
              content:
                msg.content && msg.content.length
                  ? (msg.content[0] as TextContentPart).text
                  : '',
              attachments: msg.attachments.map(attachment => attachment.name),
            },
          ],
          async (newThreadId?: string) => {
            console.log('callback', agentId, threadId, newThreadId)
            if (typeof window !== 'undefined')
              window.history.pushState(
                null,
                '',
                `/duck/${agentId}/${newThreadId}`,
              )
            // router.push(`/duck/${agentId}/${newThreadId}`)
            setTimeout(async () => {
              console.log('invalidated threadlist')
              await invalidate()
            }, 2000)
          },
        )
      },
    }),
  }
}

// export function useEdenRuntimeExtras(): EdenExtras;
// export function useEdenRuntimeExtras<T>(selector: (extras: EdenExtras) => T): T;
export function useEdenRuntimeExtras<T>(
  selector: (extras: EdenExtras) => T = extras => extras as T,
): T {
  return useThread(t => {
    const extras = t.extras as EdenExtras
    if (!extras[symbolEdenExtras])
      throw new Error(
        'useEdenRuntimeExtras can only be used inside a Eden runtime',
      )

    return selector(extras)
  })
}

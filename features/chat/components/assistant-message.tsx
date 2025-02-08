'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import TypingIndicator from '@/features/chat/components/typing-indicator'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import {
  AssistantActionBar,
  AssistantMessage,
  BranchPicker,
  useMessage,
  useThreadConfig,
} from '@assistant-ui/react'
import type { FC } from 'react'

const MyAssistantMessageAvatar: FC = () => {
  const { assistantAvatar: avatar = { fallback: 'A' } } = useThreadConfig()
  return (
    <div className="flex items-center md:items-start">
      <Avatar className="w-10 h-10 md:w-12 md:h-12 mx-1 md:mx-2">
        <AvatarImage
          className={'object-cover'}
          src={getCloudfrontOriginalUrl(avatar.src)}
        />
        <AvatarFallback delayMs={250} className="w-10 h-10 md:w-12 md:h-12">
          {avatar.fallback}
        </AvatarFallback>
      </Avatar>
      <div className="block md:hidden text-sm text-muted-foreground">
        {avatar.fallback}
      </div>
    </div>
  )
}

const MyAssistantActionBar: FC = () => {
  return (
    <AssistantActionBar.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
    >
      {/*<AssistantActionBar.SpeechControl />*/}
      <AssistantActionBar.Copy />
      {/*<AssistantActionBar.Reload />*/}
      <AssistantActionBar.FeedbackPositive />
      <AssistantActionBar.FeedbackNegative />
    </AssistantActionBar.Root>
  )
}

const MyAssistantMessage: FC = () => {
  const content = useMessage(m => m.content)
  const status = useMessage(m => m.status)
  const id = useMessage(m => m.id)
  const isLast = useMessage(m => m.isLast);
  const isEmpty = !content || content.length === 0
  const isRunning = status?.type === 'running'

  return (
    isLast ? (
      <AssistantMessage.Root
      className={cn([
        'block px-2 mb-4 sm:px-0 sm:grid max-w-none',
        isRunning && 'border border-purple-600/40 bg-purple-900/5 rounded-lg',
      ])}
    >
      <MyAssistantMessageAvatar />
      <AssistantMessage.Content key={id} />
      <BranchPicker />
      <MyAssistantActionBar />
      {!isEmpty && isRunning && (
        <div className="col-start-3 row-start-2">
          <TypingIndicator />
        </div>
      )}
    </AssistantMessage.Root>
    ) : (<></>)
  )
}

export default MyAssistantMessage

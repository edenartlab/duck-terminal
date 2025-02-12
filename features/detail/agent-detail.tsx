'use client'

import TextClampMore from '@/components/text/text-clamp-more'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import UserAvatarLink from '@/components/user/user-avatar-link'
import AgentFormSheet from '@/features/agent/agent-form-sheet'
import CreationsFeed from '@/features/feed/creations-feed'
import { useAgentQuery } from '@/hooks/query/use-agent-query'
import { useAuthState } from '@/hooks/use-auth-state'
import {
  updateDeleteDialog,
  updateShareModal,
} from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { Agent } from '@edenlabs/eden-sdk'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { Share2Icon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  id: string
  agentSSRData?: Agent
}

const AgentDetail = ({ id, agentSSRData }: Props) => {
  const router = useRouter()
  const { user } = useAuthState()
  const dispatch = useAppDispatch()

  const { agent: agentClientData, invalidate } = useAgentQuery({
    key: id,
    initialData: agentSSRData
      ? {
          agent: agentSSRData,
        }
      : undefined,
  })

  const agent = agentClientData || agentSSRData

  const onDeleteAgent = async () => {
    const handleDelete = async () => {
      try {
        await axios.delete(`/api/agents/${id}`)
        toast.success('Agent deleted', {
          description: `Agent: ${agent?.name} deleted successfully`,
          dismissible: true,
          richColors: true,
        })
        router.push(`/creators/${user?.username}?tab=agents`)
      } catch (error) {
        toast.error('Failed to delete agent', {
          description: `Agent: ${agent?.name} failed to delete`,
          dismissible: true,
          richColors: true,
        })
      }
    }

    dispatch(
      updateDeleteDialog({
        isOpen: true,
        title: 'Delete Agent',
        description: 'Are you sure you want to delete this agent?',
        onDelete: handleDelete,
      }),
    )
  }

  const onUpdateAgent = async () => {
    await invalidate()
  }

  const onShareAgent = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/agents/${agent?._id}`
    dispatch(
      updateShareModal({
        isOpen: true,
        shareUrl,
      }),
    )
  }

  if (!agent) return null

  return (
    <>
      <div className="relative p-6 bg-muted-darker rounded-md mx-4 mt-4">
        {user?._id === agent?.owner._id && (
          <div className="absolute right-6 flex gap-x-2">
            <AgentFormSheet
              mode={'update'}
              agent={agent}
              onAction={onUpdateAgent}
            />
            <Button variant="destructive" size="icon" onClick={onDeleteAgent}>
              <TrashIcon size={18} />
            </Button>
          </div>
        )}
        <div className="flex gap-4 items-center mb-4">
          <Avatar className="size-24">
            {agent.userImage ? (
              <AvatarImage className={'object-cover'} src={agent.userImage} />
            ) : (
              <AvatarFallback>{agent.name[0]}</AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{agent?.name}</h1>
          <div className="flex gap-x-2">
            <Button variant="outline" size="icon" onClick={onShareAgent}>
              <Share2Icon size={18} />
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/duck/${agent._id}`}>
                <ChatBubbleIcon className="mr-2 h-4 w-4" />
                Start Chat
              </Link>
            </Button>
          </div>
        </div>

        <TextClampMore
          text={agent?.description}
          className="text-sm break-words mt-2 text-muted-darker-foreground"
        />
        <div className="flex items-center gap-x-2 mt-2 text-sm text-muted-foreground">
          by{' '}
          <span>
            <UserAvatarLink
              name={agent.owner.username || agent.owner._id}
              image={agent.owner.userImage}
            />
          </span>
        </div>
      </div>
      <div className="p-4">
        <CreationsFeed query={{ user: agent._id }} />
      </div>
    </>
  )
}

export default AgentDetail

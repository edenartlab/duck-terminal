import AgentActionsMenu from '@/components/button/agent-actions-menu'
import CardImage from '@/components/card/components/card-image'
import PrivateIcon from '@/components/icons/private-icon'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Agent } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { SquareMousePointerIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  agent: Agent
  queryKey: QueryKey
  onClick?: (item: Agent) => void
  className?: string
}

const AgentCard = ({ agent, queryKey, onClick, className }: Props) => {
  return (
    <Card
      className={cn([
        'relative overflow-hidden border-0 z-10 transition-shadow group bg-secondary',
        className,
      ])}
    >
      {!agent.public ? <PrivateIcon className="" /> : null}
      {onClick ? (
        <div
          className="absolute inset-0 flex items-center justify-center w-full h-full cursor-pointer hover:ring-2 ring-offset-1 ring-primary-foreground z-50 opacity-0 bg-popover group-hover:opacity-50 [@media(pointer:coarse)]:opacity-50 transition-all"
          onClick={() => onClick(agent)}
        >
          <SquareMousePointerIcon className="mr-2 h-4 w-4" />
          Select
        </div>
      ) : null}
      <Link
        href={`/chat/${agent.username}`}
        prefetch={false}
        className="relative w-full block"
      >
        <div className="relative flex p-2">
          <CardImage
            media={{
              url: agent.userImage,
              thumbnail: agent.userImage,
              width: 512,
              height: 512,
              type: 'image',
              blurhash: agent.blurhash,
            }}
            unoptimized={true}
            className="object-cover rounded-lg w-[90px] h-[132px] flex-shrink-0 flex-grow-0"
          />
          <div className="ml-3 flex flex-col w-full">
            <span className="font-semibold text-sm mr-auto">{agent.name}</span>

            <div className="text-xs text-accent-foreground line-clamp-3 mt-2">
              {agent.description}
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap mt-auto">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                by <span className="font-semibold">{agent.owner.username}</span>
              </div>
              <AgentActionsMenu key={1} agent={agent} queryKey={queryKey} />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default AgentCard

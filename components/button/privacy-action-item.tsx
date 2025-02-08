import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { usePrivacyToggle } from '@/hooks/use-privacy-toggle'
import { Agent, CollectionV2, CreationV2, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { LockIcon, LockOpenIcon } from 'lucide-react'
import React from 'react'

type Props = {
  item: ModelV2 | CreationV2 | CollectionV2 | Agent
  type: 'creation' | 'model' | 'collection' | 'agent'
  queryKey: QueryKey
}

const PrivacyActionItem = ({ type, item, queryKey }: Props) => {
  const { handleToggle } = usePrivacyToggle({ type, item, queryKey })

  return (
    <DropdownMenuItem onClick={handleToggle} className="cursor-pointer">
      {item.public ? (
        <LockIcon className="mr-2 h-4 w-4" />
      ) : (
        <LockOpenIcon className="mr-2 h-4 w-4" />
      )}
      <span>
        Set <strong>{item.public ? 'Private' : 'Public'}</strong>
      </span>
      {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
    </DropdownMenuItem>
  )
}

export default PrivacyActionItem

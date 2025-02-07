import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { usePrivacyToggleBulk } from '@/hooks/use-privacy-toggle-bulk'
import { CreationV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { LockIcon, LockOpenIcon } from 'lucide-react'
import React from 'react'

type Props = {
  items: CreationV2[]
  type: 'creation'
  queryKey: QueryKey
}

const PrivacyBulkActionItem = ({ type, items, queryKey }: Props) => {
  const { handleSetPrivate, handleSetPublic } = usePrivacyToggleBulk({
    type,
    items,
    queryKey,
  })

  return (
    <>
      <DropdownMenuItem onClick={handleSetPrivate} className="cursor-pointer">
        <LockIcon className="mr-2 h-4 w-4" />
        <span>
          Set <strong>Private</strong>
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleSetPublic} className="cursor-pointer">
        <LockOpenIcon className="mr-2 h-4 w-4" />
        <span>
          Set <strong>Public</strong>
        </span>
      </DropdownMenuItem>
    </>
  )
}

export default PrivacyBulkActionItem

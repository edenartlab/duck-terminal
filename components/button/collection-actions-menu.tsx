import ActionsDropdown from '@/components/button/actions-dropdown'
import DeleteActionItem from '@/components/button/delete-action-item'
import PrivacyActionItem from '@/components/button/privacy-action-item'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAuthState } from '@/hooks/use-auth-state'
import { CollectionV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
  collection: CollectionV2
  queryKey: QueryKey
  className?: string
}

const CollectionActionsMenu = ({ collection, queryKey, className }: Props) => {
  const { user } = useAuthState()
  const [isOpen, setIsOpen] = useState(false)

  if (!collection) {
    return null
  }

  return (
    <ActionsDropdown className={className} onOpenChange={setIsOpen}>
      {isOpen && (
        <CollectionActionsContent
          collection={collection}
          queryKey={queryKey}
          userId={user?._id}
        />
      )}
    </ActionsDropdown>
  )
}

type ContentProps = {
  collection: CollectionV2
  queryKey: QueryKey
  userId?: string
}

const CollectionActionsContent = ({
  collection,
  queryKey,
  userId,
}: ContentProps) => {
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href={`/collections/${collection._id}`}>
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      {collection.user._id === userId && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <PrivacyActionItem
              type="collection"
              item={collection}
              queryKey={queryKey}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DeleteActionItem
              type="collection"
              item={collection}
              queryKey={queryKey}
            />
          </DropdownMenuGroup>
        </>
      )}
    </>
  )
}

export default CollectionActionsMenu

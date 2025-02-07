'use client'

import DeleteBulkActionItem from '@/components/button/delete-bulk-action-item'
import PrivacyBulkActionItem from '@/components/button/privacy-bulk-action-item'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateAddToCollectionModal } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { CreationV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import axios from 'axios'
import {
  BookmarkMinusIcon,
  BookmarkPlusIcon,
  EllipsisIcon,
  PictureInPicture2Icon,
  PictureInPictureIcon,
} from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface CreationsBulkActionsMenuProps {
  creations: CreationV2[]
  queryKey: QueryKey
}

const CreationsBulkActionsMenu = ({
  creations,
  queryKey,
}: CreationsBulkActionsMenuProps) => {
  const dispatch = useAppDispatch()

  const handleAddToCollectionSelect = () => {
    dispatch(
      updateAddToCollectionModal({
        isOpen: true,
        creationIds: creations.map(creation => creation._id),
      }),
    )
  }

  const pathname = usePathname()
  const params = useParams()
  const collectionId =
    pathname.startsWith('/collections') && params && params.id
      ? params.id
      : undefined

  const handleRemoveFromCollection = async (collectionId: string) => {
    try {
      await axios.patch(`/api/collections/${collectionId}/remove-creations`, {
        creationIds: creations.map(creation => creation._id),
      })
      toast.success('Creations removed from collection', {
        description: `Creations removed from collection successfully`,
        dismissible: true,
        richColors: true,
      })
    } catch (error) {
      toast.error('Failed to remove creations from collection', {
        description: `Failed to remove creations from collection`,
        dismissible: true,
        richColors: true,
      })
    }
  }

  if (!creations) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <EllipsisIcon className="group-hover:text-primary" />
            <span className="ml-2 hidden md:block">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <PrivacyBulkActionItem
              type="creation"
              items={creations}
              queryKey={queryKey}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleAddToCollectionSelect}
            className="cursor-pointer group"
          >
            <BookmarkPlusIcon className="mr-2 h-4 w-4" />
            <span>Add to Collection</span>
            <PictureInPicture2Icon className="group-hover:hidden h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
            <PictureInPictureIcon className="hidden group-hover:block h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
          </DropdownMenuItem>
          {collectionId ? (
            <DropdownMenuItem
              onClick={() => handleRemoveFromCollection(String(collectionId))}
              className="cursor-pointer"
            >
              <BookmarkMinusIcon className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DeleteBulkActionItem
              type="creation"
              items={creations}
              queryKey={queryKey}
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CreationsBulkActionsMenu

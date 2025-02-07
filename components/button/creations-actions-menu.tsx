import ActionsDropdown from '@/components/button/actions-dropdown'
import DeleteActionItem from '@/components/button/delete-action-item'
import DownloadActionItem from '@/components/button/download-action-item'
import PrivacyActionItem from '@/components/button/privacy-action-item'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useCreationQuery } from '@/hooks/query/use-creation-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { getFileTypeByMimeType } from '@/lib/files'
import {
  updateAddToCollectionModal,
  updateQuickAnimateModal,
  updateQuickUpscaleModal,
  updateShareModal,
} from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { generateFilename } from '@/utils/slug.util'
import { CreationV2 } from '@edenlabs/eden-sdk'
import { SizeIcon } from '@radix-ui/react-icons'
import { QueryKey } from '@tanstack/react-query'
import {
  BookmarkPlusIcon,
  ExternalLinkIcon,
  FileSlidersIcon,
  FilmIcon,
  PictureInPicture2Icon,
  PictureInPictureIcon,
  Share2Icon,
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
  creation: CreationV2
  queryKey: QueryKey
  className?: string
}

const CreationActionsMenu = ({ creation, queryKey, className }: Props) => {
  const { user } = useAuthState()
  const [isOpen, setIsOpen] = useState(false)

  if (!creation) {
    return null
  }

  return (
    // <div className={cn(['', className])}>
    //   {/*<CreationPresetLink creation={creation} hideLabel={true} />*/}
    //   <ActionsDropdown onOpenChange={setIsOpen}>
    //     {isOpen && (
    //       <CreationActionsContent
    //         creation={creation}
    //         queryKey={queryKey}
    //         userId={user?._id}
    //         isOpen={isOpen}
    //       />
    //     )}
    //   </ActionsDropdown>
    // </div>
    <>
      <ActionsDropdown className={className} onOpenChange={setIsOpen}>
        {isOpen && (
          <CreationActionsContent
            creation={creation}
            queryKey={queryKey}
            userId={user?._id}
            isOpen={isOpen}
          />
        )}
      </ActionsDropdown>
    </>
  )
}

type ContentProps = {
  creation: CreationV2
  queryKey: QueryKey
  userId?: string
  isOpen?: boolean
}

const CreationActionsContent = ({
  creation,
  queryKey,
  userId,
  isOpen,
}: ContentProps) => {
  const dispatch = useAppDispatch()

  const { isSignedIn } = useAuthState()
  const { creation: creationResponse } = useCreationQuery({
    key: creation._id,
    initialData: {
      creation,
    },
    enabled: isOpen,
  })

  const creationData = creationResponse || creation

  // console.log({ creationData, creationResponse, creation })

  const handleAddToCollectionClick = () => {
    dispatch(
      updateAddToCollectionModal({
        isOpen: true,
        creationIds: [creationData._id],
      }),
    )
  }

  const handleQuickAnimateClick = () => {
    dispatch(updateQuickAnimateModal({ isOpen: true, creation: creationData }))
  }

  const handleQuickUpscaleClick = () => {
    dispatch(updateQuickUpscaleModal({ isOpen: true, creation: creationData }))
  }

  const handleShareClick = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/creations/${creationData._id}`
    dispatch(
      updateShareModal({
        isOpen: true,
        shareUrl: shareUrl,
      }),
    )
  }

  const fileType =
    getFileTypeByMimeType(creationData.mediaAttributes?.mimeType) || 'image'

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="cursor-pointer"
            href={`/creations/${creationData._id}`}
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            View Details
            {/*<DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>*/}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <button type="button" className="w-full" onClick={handleShareClick}>
            <Share2Icon className="mr-2 h-4 w-4" />
            Share
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer w-full group"
          onClick={handleAddToCollectionClick}
          disabled={!isSignedIn}
        >
          <BookmarkPlusIcon className="mr-2 h-4 w-4" />
          Add to collection
          <PictureInPicture2Icon className="group-hover:hidden h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
          <PictureInPictureIcon className="hidden group-hover:block h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {fileType === 'image' ? (
          <>
            <DropdownMenuItem
              disabled={!isSignedIn}
              className="cursor-pointer group"
              onClick={handleQuickAnimateClick}
            >
              <FilmIcon className="mr-2 h-4 w-4" />
              Animate
              <PictureInPicture2Icon className="group-hover:hidden h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
              <PictureInPictureIcon className="hidden group-hover:block h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isSignedIn}
              className="cursor-pointer group"
              onClick={handleQuickUpscaleClick}
            >
              <SizeIcon className="mr-2 h-4 w-4" />
              Upscale
              <PictureInPicture2Icon className="group-hover:hidden h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
              <PictureInPictureIcon className="hidden group-hover:block h-4 w-4 ml-auto text-muted-foreground group-hover:text-popover-foreground" />
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem asChild disabled={!isSignedIn}>
          <Link
            className="cursor-pointer flex items-center"
            href={`/create/${fileType}/${creation.tool}?creation=${creation._id}`}
            scroll={false}
            shallow={true}
            prefetch={false}
          >
            <FileSlidersIcon className="mr-2 h-4 w-4" />
            Use as Preset
            {/*<DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>*/}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      {creationData.user._id === userId && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <PrivacyActionItem
              type="creation"
              item={creationData}
              queryKey={queryKey}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DeleteActionItem
              type="creation"
              item={creationData}
              queryKey={queryKey}
            />
          </DropdownMenuGroup>
        </>
      )}
      {isSignedIn ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DownloadActionItem
              type="creation"
              originalFileUrl={creationData.filename || ''}
              saveAsFileName={generateFilename(
                creationData.user.username,
                creationData.task.args?.prompt?.substring(0, 64).trim(),
                creationData._id,
              )}
            />
          </DropdownMenuGroup>
        </>
      ) : null}
    </>
  )
}

export default CreationActionsMenu

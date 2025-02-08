'use client'

import { MediaDurationBadge } from '@/components/badge/media-duration-badge'
import ActionsDropdown from '@/components/button/actions-dropdown'
import LikeButton from '@/components/button/like-button'
import CardFooter from '@/components/card/components/card-footer'
import CardImage from '@/components/card/components/card-image'
import PrivateIcon from '@/components/icons/private-icon'
import VideoResult from '@/components/media/video-result'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMultiSelection } from '@/contexts/multi-select-context'
import { useHover } from '@/hooks/use-hover'
import { getFileTypeByMimeType } from '@/lib/files'
import { getCloudfrontUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import { CreationV2, Creator } from '@edenlabs/eden-sdk'
import { AudioLinesIcon, CheckIcon, SquareIcon } from 'lucide-react'
import Link from 'next/link'
import React, { CSSProperties, useState } from 'react'

type Props = {
  creation: CreationV2
  linkHref: string
  creator?: Creator
  showFooter?: boolean
  style?: CSSProperties
  onUpdate?: (item: CreationV2) => void
  multiselect?: boolean
}

const CreationCard = ({
  creation,
  showFooter,
  style,
  multiselect = false,
}: Props) => {
  const { hovered, ref } = useHover()
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false)
  const { toggleSelection, isSelected, selectedItems } = useMultiSelection()

  const handleSelection = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    event.nativeEvent.stopImmediatePropagation()
    toggleSelection(creation)
  }

  const selected = isSelected(creation)
  const fileType =
    getFileTypeByMimeType(creation.mediaAttributes?.mimeType) || 'image'
  return (
    <Card
      ref={ref}
      className="relative overflow-hidden border-0 z-10"
      style={style}
    >
      {creation.deleted ? (
        <div className="absolute inset-0 w-full h-full z-10 bg-accent/70 drop-shadow flex justify-center items-center">
          <div className="p-1 bg-destructive/50 text-destructive-foreground text-xs rounded-sm backdrop-blur-[2px]">
            deleted
          </div>
        </div>
      ) : null}
      <Link
        href={`/creations/${creation._id}`}
        prefetch={false}
        className={cn([
          'relative w-full block group',
          selected ? 'bg-popover-foreground/30' : '',
        ])}
      >
        {!creation.public ? (
          <PrivateIcon className="absolute right-2 top-2 pointer-events-none" />
        ) : null}
        {multiselect ? (
          <div className={`absolute inset-0 w-full h-full z-10 card-gradient`}>
            {/* Always show multi select checkbox when input type === coarse? */}
            <Button
              variant="ghost"
              className={cn([
                'relative top-1 left-1 p-1 h-9 w-9 [@media(pointer:coarse)]:h-7 [@media(pointer:coarse)]:w-7 overflow-hidden !bg-gray-300 !bg-opacity-0 hover:!bg-opacity-20 [@media(pointer:coarse)]:!bg-opacity-20',
                selectedItems.length ? '!bg-opacity-10' : '',
              ])}
              onClick={handleSelection}
              aria-pressed={selected}
              aria-label={selected ? 'Deselect item' : 'Select item'}
            >
              {selected ? (
                <CheckIcon className="h-5 w-5 p-0.5 bg-purple-600 rounded-sm text-white opacity-95 group-hover:opacity-100 drop-shadow" />
              ) : (
                <SquareIcon
                  className={cn([
                    `h-4 w-4 text-white opacity-0 [@media(pointer:coarse)]:opacity-70 group-hover:opacity-100 drop-shadow`,
                    selectedItems.length ? 'opacity-50' : '',
                  ])}
                />
              )}
            </Button>
          </div>
        ) : null}
        <div
          className={cn([
            'transition-transform',
            selected ? 'scale-[0.80] rounded-md overflow-hidden' : '',
          ])}
        >
          {fileType === 'audio' ? (
            <div className="flex items-center justify-center h-32">
              <MediaDurationBadge
                duration={creation.mediaAttributes?.duration}
                isLoading={false}
              />
              <AudioLinesIcon className="h-12 w-12" />
            </div>
          ) : (
            <CardImage
              media={{
                url: creation.url,
                thumbnail: creation.thumbnail,
                width: creation.mediaAttributes?.width,
                height: creation.mediaAttributes?.height,
                type: fileType,
                blurhash: creation.mediaAttributes?.blurhash,
              }}
            />
          )}

          {fileType === 'video' ? (
            <>
              <MediaDurationBadge
                duration={creation.mediaAttributes?.duration}
                isLoading={hovered && !hasStartedPlayback}
              />
              {hovered ? (
                <VideoResult
                  className="absolute inset-0 pointer-events-none"
                  videoUrl={getCloudfrontUrl(creation.url) || ''}
                  width={creation.mediaAttributes?.width}
                  height={creation.mediaAttributes?.height}
                  muted={true}
                  loop={true}
                  autoPlay={true}
                  controls={false}
                  onPlay={() => setHasStartedPlayback(true)}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </Link>
      {showFooter ? (
        <CardFooter
          // creator={creator}
          actions={[
            <LikeButton
              key={0}
              count={4}
              isActive={false}
              onChange={() => null}
            />,
            <ActionsDropdown key={1} />,
          ]}
        />
      ) : null}
    </Card>
  )
}

export default CreationCard

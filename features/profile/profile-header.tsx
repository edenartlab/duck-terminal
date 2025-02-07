'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TypographyH3 from '@/components/ui/typography/TypographyH3'
import { useCreatorQuery } from '@/hooks/query/use-creator-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { updateShareModal } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { Creator } from '@edenlabs/eden-sdk'
import { Share2Icon } from 'lucide-react'
import Image from 'next/image'

type Props = {
  name: string
  creatorSSRData: Creator
}

const ProfileHeader = ({ name, creatorSSRData }: Props) => {
  const dispatch = useAppDispatch()

  const { user } = useAuthState()
  const { creator: creatorClientData } = useCreatorQuery({
    key: name,
    initialData: {
      creator: creatorSSRData,
    },
  })

  const creator = creatorClientData || creatorSSRData

  const onShareProfile = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/creators/${creator.username}`
    dispatch(
      updateShareModal({
        isOpen: true,
        shareUrl,
      }),
    )
  }

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <div className="relative rounded-full overflow-hidden border-popover-foreground border-2 h-16 w-16 lg:h-24 lg:w-24">
          <Image
            src={creator.userImage || ''}
            alt={creator.username || ''}
            width={96}
            height={96}
          />
        </div>
        <div>
          <TypographyH3 className="text-lg md:text-xl mb-2">
            {name}
          </TypographyH3>
          <div>
            {user?._id === creator?._id ? (
              <Badge variant={'outline'}>My profile</Badge>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onShareProfile}
        >
          <Share2Icon className="size-4" />
          Share
        </Button>
      </div>
    </div>
  )
}

export default ProfileHeader

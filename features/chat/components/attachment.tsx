'use client'

import LoadingIndicator from '@/components/loading-indicator'
import { LightboxTrigger } from '@/components/media/lightbox'
import { TooltipIconButton } from '@/components/ui/assistant-ui/tooltip-icon-button'
import { Progress } from '@/components/ui/progress'
import { siteConfig } from '@/lib/config'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import {
  AttachmentPrimitive,
  ImageContentPart,
  useAttachment,
  useComposer,
  useThreadConfig,
} from '@assistant-ui/react'
import { CircleXIcon } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

const useFileSrc = (file: File | undefined) => {
  const [src, setSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!file) {
      setSrc(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setSrc(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return src
}

const useAttachmentSrc = () => {
  const { file, src } = useAttachment(
    useShallow((a): { file?: File; src?: string } => {
      if (a.type !== 'image') return {}
      if (a.file) return { file: a.file }
      const imageContentPart = a.content?.filter(
        c => c.type === 'image',
      )[0] as ImageContentPart
      const src = imageContentPart?.image
      if (!src) return {}
      return { src }
    }),
  )

  return useFileSrc(file) ?? src
}

const AttachmentRemove: FC = () => {
  const {
    strings: {
      composer: { removeAttachment: { tooltip = 'Remove file' } = {} } = {},
    } = {},
  } = useThreadConfig()

  return (
    <AttachmentPrimitive.Remove asChild>
      <TooltipIconButton
        tooltip={tooltip}
        side="top"
        className="absolute top-[-8px] right-[-8px]"
      >
        <CircleXIcon />
      </TooltipIconButton>
    </AttachmentPrimitive.Remove>
  )
}

const MyAttachment: FC = () => {
  const canRemove = useAttachment(a => a.source !== 'message')
  // const typeLabel = useAttachment(a => {
  //   const type = a.type
  //   switch (type) {
  //     case 'image':
  //       return 'Image'
  //     case 'document':
  //       return 'Document'
  //     case 'file':
  //       return 'File'
  //     default:
  //       throw new Error(`Unknown attachment type: ${type as never}`)
  //   }
  // })

  const uploadProgress = useAttachment(a =>
    a.status.type === 'running' ? a.status.progress : 1,
  )
  const attachment = useAttachment()

  // @ts-ignore
  const fileUrl = attachment.file ? attachment.file.fileUrl : ''

  const src = useAttachmentSrc()

  const attachments = useComposer(s => s.attachments)
  // console.log({ attachments })

  const attachmentIndex = attachments.findIndex(a => a.id === attachment.id)
  return (
    <AttachmentPrimitive.Root
      className={cn([
        'relative rounded-md border border-secondary cursor-pointer ',
        canRemove ? ' mt-2 hover:bg-accent' : 'w-auto items-center',
      ])}
    >
      {uploadProgress !== 1 ? (
        <div className="absolute rounded-md bg-background/40 w-full h-full overflow-hidden">
          <LoadingIndicator className="w-full h-full p-1.5" />
          <Progress
            max={1}
            value={uploadProgress}
            className="h-1 bottom-0.5 rounded-none bg-transparent"
          />
        </div>
      ) : null}
      <div
        className={cn([
          'p-1 flex gap-1 h-full ',
          canRemove ? 'p-0.5' : 'max-h-48 items-center',
        ])}
      >
        {/*<AttachmentThumb />*/}
        <LightboxTrigger
          startIndex={attachmentIndex}
          className="flex items-center justify-center"
          slide={{
            url: canRemove
              ? getCloudfrontOriginalUrl(fileUrl)
              : src ?? siteConfig.mediaErrorUrl,
            thumbnail: src ?? siteConfig.mediaErrorUrl,
          }}
          imageProps={{
            className: canRemove
              ? 'object-cover flex-shrink-0 max-w-16 h-12'
              : 'object-contain w-full max-h-48 max-w-48 flex-shrink-0',
            unoptimized: true,
          }}
        />
      </div>
      {canRemove && <AttachmentRemove />}
    </AttachmentPrimitive.Root>
  )
}

export default MyAttachment

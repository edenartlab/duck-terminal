import { LightboxGallery, LightboxTrigger } from '@/components/media/lightbox'
import { getFileTypeByMimeType } from '@/lib/files'
import { CreationV2 } from '@edenlabs/eden-sdk'
import React from 'react'

type Props = {
  creation: CreationV2
  isModal?: boolean
}

const CreationMediaPreview = ({ creation, isModal }: Props) => {
  const fileType =
    getFileTypeByMimeType(creation.mediaAttributes?.mimeType) || 'image'

  return (
    <div className="relative w-full my-4 flex justify-center items-center">
      {creation?.deleted ? (
        <div className="absolute inset-0 w-full h-full z-10 bg-accent/70 drop-shadow flex justify-center items-center">
          <div className="p-1 bg-destructive/50 text-destructive-foreground text-xs rounded-sm backdrop-blur-[2px]">
            deleted
          </div>
        </div>
      ) : null}
      {fileType === 'audio' ? (
        <div className="flex w-full h-full items-center justify-center min-h-64">
          <audio src={creation.url} controls={true} />
        </div>
      ) : (
        <LightboxGallery>
          <LightboxTrigger
            className="flex justify-center items-center h-full"
            slide={{
              url: creation.url!,
              thumbnail: creation.thumbnail,
              width: creation.mediaAttributes?.width,
              height: creation.mediaAttributes?.height,
              duration: creation.mediaAttributes?.duration || undefined,
              description:
                creation.task.args &&
                creation.task.args &&
                creation.task.args.prompt
                  ? String(creation.task.args.prompt)
                  : undefined,
              title:
                creation.tool && creation.tool && creation.tool
                  ? String(creation.tool)
                  : undefined,
            }}
            imageProps={{
              className: isModal
                ? 'max-h-[calc(100dvh_-_130px)]'
                : 'max-h-[calc(100dvh_-_230px)]',
              blurhash: creation.mediaAttributes?.blurhash,
            }}
            videoProps={{
              className: isModal
                ? 'max-h-[calc(100dvh_-_130px)]'
                : 'max-h-[calc(100dvh_-_230px)]',
              poster: creation.thumbnail,
              duration: null,
              controls: true,
              autoPlay: true,
              onMouseEnter: () => {},
              onMouseLeave: () => {},
            }}
          />
        </LightboxGallery>
      )}
    </div>
  )
}

export default CreationMediaPreview

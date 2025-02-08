import { LightboxGallery, LightboxTrigger } from '@/components/media/lightbox'
import { ModelV2 } from '@edenlabs/eden-sdk'
import React from 'react'

type Props = {
  model: ModelV2
  isModal?: boolean
}

const ModelMediaPreview = ({ model, isModal }: Props) => {
  return (
    <div className="relative w-full my-4 flex justify-center items-center">
      {model.deleted ? (
        <div className="absolute inset-0 w-full h-full z-10 bg-accent/70 drop-shadow flex justify-center items-center">
          <div className="p-1 bg-destructive/50 text-destructive-foreground text-xs rounded-sm backdrop-blur-[2px]">
            deleted
          </div>
        </div>
      ) : null}
      <LightboxGallery>
        <LightboxTrigger
          className="flex justify-center items-center"
          slide={{
            url: model.thumbnail,
            thumbnail: model.thumbnail,
            width: 1024,
            height: 1024,
          }}
          imageProps={{
            className: isModal
              ? 'max-h-[calc(100dvh_-_130px)]'
              : 'max-h-[calc(100dvh_-_230px)]',
          }}
        />
      </LightboxGallery>
    </div>
  )
}

export default ModelMediaPreview

import 'photoswipe/dist/photoswipe.css'

import { MediaDurationBadge } from '@/components/badge/media-duration-badge'
import VideoResult from '@/components/media/video-result'
import { useBlurDataUrl } from '@/hooks/use-blur-hash'
import { useHover } from '@/hooks/use-hover'
import customImageLoader from '@/image-loader'
import { siteConfig } from '@/lib/config'
import { getCloudfrontUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'
import PhotoSwipe from 'photoswipe'
import React, { PropsWithChildren, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'

type GalleryItem = {
  url?: string
  thumbnail?: string
  width?: number
  height?: number
  duration?: number
  blurhash?: string
}

type LightboxGalleryItemProps = {
  item: GalleryItem
  unoptimized?: boolean
  forceRender?: boolean
  className?: string
  sizeOnLoad?: boolean
}

export const LightboxGalleryItem = ({
  sizeOnLoad,
  item,
  unoptimized,
  forceRender,
  className,
}: LightboxGalleryItemProps) => {
  const { hovered, ref: hoverRef } = useHover()
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false)
  const width = item.width || 1024
  const height = item.height || 1024
  const blurDataUrl = useBlurDataUrl(item.blurhash, item.width, item.height)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Item
      alt={item.url}
      original={
        item.url?.endsWith('.mp4')
          ? undefined
          : item.url || siteConfig.mediaErrorUrl
      }
      thumbnail={
        item.thumbnail?.endsWith('.mp4')
          ? undefined
          : item.thumbnail || siteConfig.mediaErrorUrl
      }
      width={sizeOnLoad ? undefined : width}
      height={sizeOnLoad ? undefined : height}
      content={
        item.url?.endsWith('.mp4') ? (
          <VideoResult
            videoUrl={item.url || siteConfig.mediaErrorUrl}
            width={width}
            height={height}
            posterUrl={item.thumbnail || siteConfig.mediaErrorUrl}
            muted={true}
            loop={true}
            autoPlay={true}
            controls={true}
          />
        ) : undefined
      }
    >
      {({ ref, open }) => (
        <div
          draggable
          onDragStart={e => {
            e.dataTransfer.setData('text/plain', item.url || '')
          }}
          className={cn([
            `rounded-md overflow-hidden`,
            isLoaded ? 'flex max-w-full max-h-full ' : 'w-full h-full',
          ])}
          ref={hoverRef}
        >
          {item.thumbnail?.endsWith('.mp4') ? null : (
            <NextImage
              loader={customImageLoader}
              ref={ref}
              onClick={ev => {
                ev.stopPropagation()
                open(ev)
              }}
              unoptimized={unoptimized}
              src={item.thumbnail || siteConfig.mediaErrorUrl}
              alt={item.url || ''}
              width={width}
              height={height}
              blurDataURL={blurDataUrl}
              placeholder={blurDataUrl ? 'blur' : undefined}
              className={cn([
                `object-contain cursor-zoom-in w-full !bg-contain`,
                className,
              ])}
              loading={'eager'}
              onLoad={() => {
                // console.log(event)
                setIsLoaded(true)
              }}
            />
          )}

          {item.url?.endsWith('.mp4') ? (
            <>
              {!forceRender && item.duration ? (
                <MediaDurationBadge
                  duration={item.duration}
                  isLoading={hovered && hasStartedPlayback}
                />
              ) : null}
              {item.thumbnail?.endsWith('.mp4') || forceRender || hovered ? (
                <VideoResult
                  className={cn([
                    'rounded-md',
                    item.thumbnail?.endsWith('.mp4')
                      ? ''
                      : 'absolute inset-0 cursor-zoom-in',
                    item.thumbnail?.endsWith('.mp4') || forceRender
                      ? ''
                      : 'pointer-events-none',
                    className,
                  ])}
                  videoUrl={getCloudfrontUrl(item.url) || ''}
                  width={width}
                  height={height}
                  posterUrl={
                    !item.thumbnail?.endsWith('.mp4')
                      ? getCloudfrontUrl(item.thumbnail) ||
                        siteConfig.mediaErrorUrl
                      : undefined
                  }
                  muted={true}
                  loop={true}
                  autoPlay={forceRender}
                  controls={
                    item.thumbnail?.endsWith('.mp4') ? true : !!forceRender
                  }
                  onPlay={() => setHasStartedPlayback(true)}
                />
              ) : null}
            </>
          ) : null}
        </div>
      )}
    </Item>
  )
}

type LightboxGalleryProps = {
  sizeOnLoad?: boolean
  withDownloadButton?: boolean
} & PropsWithChildren

const LightboxGallery = ({
  children,
  sizeOnLoad,
  withDownloadButton,
}: LightboxGalleryProps) => {
  const handleOnBeforeOpen = (psInstance: PhotoSwipe) => {
    const ds = psInstance?.options?.dataSource
    // console.log({ds})
    if (Array.isArray(ds)) {
      for (let idx = 0, len = ds.length; idx < len; idx++) {
        const item = ds[idx]
        const img = new Image()
        img.onload = () => {
          item.width = img.naturalWidth
          item.height = img.naturalHeight
          psInstance?.refreshSlideContent(idx)
        }
        img.src = item.src as string
      }
    }
  }

  const handleOnOpen = (psInstance: PhotoSwipe) => {
    console.log({ psInstance })
  }

  return (
    <Gallery
      options={{
        bgOpacity: 1,
        preloaderDelay: 1000,
        // getViewportSizeFn: function(options, pswp) {
        //   const size = {
        //     x: document.documentElement.clientWidth - 200,
        //     y: window.innerHeight,
        //   }
        //
        //   console.log({size})
        //
        //   return size
        // },
      }}
      withDownloadButton={withDownloadButton}
      onBeforeOpen={sizeOnLoad ? handleOnBeforeOpen : undefined}
      onOpen={sizeOnLoad ? handleOnOpen : undefined}
    >
      {children}
    </Gallery>
  )
}

export default LightboxGallery

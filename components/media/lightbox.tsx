import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/styles.css'

import { MediaDurationBadge } from '@/components/badge/media-duration-badge'
import { useBlurDataUrl } from '@/hooks/use-blur-hash'
import { useHover } from '@/hooks/use-hover'
import customImageLoader from '@/image-loader'
import { siteConfig } from '@/lib/config'
import { getCloudfrontUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import NextImage, { ImageProps } from 'next/image'
import React from 'react'
import { ReactNode, createContext, useContext, useState } from 'react'
import Lightbox, { Slide } from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

// Context type and creation
type LightboxContextType = {
  open: boolean
  startIndex: number
  setOpen: (open: boolean) => void
  setStartIndex: (index: number) => void
  addSlide: (slide: Slide) => void
}

const LightboxContext = createContext<LightboxContextType | undefined>(
  undefined,
)

// Hook for using the context
function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox must be used within a LightboxProvider')
  }
  return context
}

export type LightboxGallerySlide = {
  url: string
  thumbnail?: string
  width?: number
  height?: number
  duration?: number
  title?: string
  description?: string
}

// Main Lightbox Gallery component
export type LightboxGalleryProps = {
  children?: ReactNode
  enableDownload?: boolean
  startIndex?: number
}

export const LightboxGallery = ({
  children,
  enableDownload = false,
}: LightboxGalleryProps) => {
  const [open, setOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])

  const addSlide = React.useCallback((slide: Slide) => {
    setSlides(prev => {
      if (!prev.some(s => JSON.stringify(s) === JSON.stringify(slide))) {
        return [...prev, slide]
      }
      return prev
    })
  }, [])

  const plugins = [
    Captions,
    Counter,
    Zoom,
    Video,
    ...(enableDownload ? [Download] : []),
  ]
  const hasSingleSlide = slides.length <= 1

  return (
    <LightboxContext.Provider
      value={{
        open,
        setOpen,
        startIndex,
        setStartIndex,
        addSlide,
      }}
    >
      {children}
      <Lightbox
        plugins={plugins}
        zoom={{
          maxZoomPixelRatio: 12,
          scrollToZoom: true,
        }}
        captions={{
          showToggle: true,
          descriptionMaxLines: 2,
        }}
        // counter={{ container: { style: { top: 'unset', bottom: 80 } } }}
        open={open}
        index={startIndex}
        close={() => setOpen(false)}
        slides={slides}
        carousel={{
          finite: hasSingleSlide,
        }}
        render={{
          buttonPrev: slides.length === 1 ? () => null : undefined,
          buttonNext: slides.length === 1 ? () => null : undefined,
        }}
        on={{
          entered: () => {
            window.dispatchEvent(new Event(`lightbox-open`))
          },
          exited: () => {
            window.dispatchEvent(new Event(`lightbox-close`))
          },
        }}
      />
    </LightboxContext.Provider>
  )
}

type LightboxTriggerProps = {
  className?: string
  startIndex?: number
  slide?: LightboxGallerySlide
  videoProps?: LightboxVideoTriggerProps
  imageProps?: LightboxImageTriggerProps
}

export const LightboxTrigger = React.forwardRef<
  HTMLDivElement,
  LightboxTriggerProps
>(({ className, slide, startIndex, videoProps, imageProps }, ref) => {
  const { setOpen, setStartIndex, addSlide } = useLightbox()

  React.useEffect(() => {
    if (!slide) return

    if (slide.url?.endsWith('.mp4')) {
      addSlide({
        type: 'video',
        width: slide.width,
        height: slide.height,
        controls: true,
        playsInline: true,
        autoPlay: true,
        muted: false,
        loop: true,
        sources: [
          {
            src: getCloudfrontUrl(slide.url) || '',
            type: 'video/mp4',
          },
        ],
        // title: slide.title,
        description: slide.description,
      })
    } else {
      addSlide({
        type: 'image',
        width: slide.width,
        height: slide.height,
        src: slide.url,
        // title: slide.title,
        description: slide.description,
      })
    }
  }, [])

  if (!slide) return null

  return (
    <div
      ref={ref}
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', slide.url || '')
      }}
      className={cn('rounded-md overflow-hidden cursor-zoom-in', className)}
      onClick={() => {
        setStartIndex(startIndex ?? 0)
        setOpen(true)
      }}
    >
      {slide?.url.endsWith('.mp4') ? (
        <LightboxVideoTrigger
          src={slide.url}
          duration={slide.duration}
          {...videoProps}
        />
      ) : (
        <LightboxImageTrigger src={slide.url} {...imageProps} />
      )}
    </div>
  )
})
LightboxTrigger.displayName = 'LightboxTrigger'

// Image Trigger Component
type LightboxImageTriggerProps = {
  src?: string
  alt?: string
  blurhash?: string
} & Omit<ImageProps, 'src' | 'alt'>

export function LightboxImageTrigger({
  src = siteConfig.mediaErrorUrl,
  alt = '',
  blurhash,
  className,
  ...props
}: LightboxImageTriggerProps) {
  const width = props?.width ? +props.width : 1024
  const height = props?.height ? +props.height : 1024
  const blurDataUrl = useBlurDataUrl(blurhash, width, height)

  return (
    <NextImage
      loader={customImageLoader}
      src={src}
      alt={alt}
      className={cn('object-contain w-full h-full !bg-contain', className)}
      blurDataURL={blurDataUrl}
      placeholder={blurDataUrl ? 'blur' : undefined}
      loading={props.loading ?? 'eager'}
      {...props}
      width={width}
      height={height}
    />
  )
}

// Video Trigger Component
type LightboxVideoTriggerProps = {
  duration?: number | null
} & React.VideoHTMLAttributes<HTMLVideoElement>

export function LightboxVideoTrigger({
  src,
  className,
  duration,
  ...props
}: LightboxVideoTriggerProps) {
  const { hovered, ref: hoverRef } = useHover()

  return (
    <div ref={hoverRef}>
      {duration && !hovered ? (
        <MediaDurationBadge duration={duration} isLoading={false} />
      ) : null}
      <video
        src={src}
        muted
        playsInline
        loop
        className={cn('flex w-full h-full object-contain', className)}
        onMouseEnter={e => {
          e.currentTarget.play()
        }}
        onMouseLeave={e => {
          e.currentTarget.pause()
          e.currentTarget.currentTime = 0
        }}
        {...props}
      />
    </div>
  )
}

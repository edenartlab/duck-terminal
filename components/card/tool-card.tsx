'use client'

import ImageWithFallback from '@/components/media/image-with-fallback'
import { Card } from '@/components/ui/card'
import TypographyH6 from '@/components/ui/typography/TypographyH6'
import Link from 'next/link'

type Props = {
  title: string
  description?: string
  image: string
  link: string
  priority?: boolean
}

const ToolCard = ({ title, image, link, description, priority }: Props) => {
  return (
    <Link prefetch={false} href={link} className="group aspect-square">
      <Card className="relative min-h-64 flex flex-col justify-between overflow-hidden border-0 h-full w-full">
        {image.endsWith('mp4') ? (
          <video
            autoPlay={true}
            muted={true}
            loop={true}
            src={image}
            playsInline={true}
            className="absolute w-full h-full object-cover data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-950/20 dark:data-[loaded=false]:bg-gray-500/10"
            onLoadedMetadata={event => {
              event.currentTarget.setAttribute('data-loaded', 'true')
            }}
          />
        ) : (
          <ImageWithFallback
            loading={priority ? undefined : 'lazy'}
            // loader={customImageLoader}
            src={image}
            alt={title}
            data-loaded="false"
            onLoad={event => {
              event.currentTarget.setAttribute('data-loaded', 'true')
            }}
            fill={true}
            priority={priority}
            sizes={
              '(max-width: 640px) 95vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
            }
            className="object-cover data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-950/20 dark:data-[loaded=false]:bg-gray-500/10"
          />
        )}
        {/*<div className="relative flex flex-col group bg-gradient-to-b from-popover/90 from-10% via-transparent via-15% hover:via-100% hover:to-100% [@media(pointer:coarse)]:via-30% [@media(pointer:coarse)]:to-75% to-transparent flex-grow transition-all">*/}
        <div className="relative flex flex-col group generator-gradient flex-grow transition-all drop-shadow">
          <div className="px-3 py-2">
            <TypographyH6 className="flex items-center justify-between opacity-75 group-hover:opacity-100 [@media(pointer:coarse)]:opacity-100 transition-all">
              {title}
            </TypographyH6>
            <div className="text-sm line-clamp-2">{description}</div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ToolCard

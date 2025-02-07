import { useBlurDataUrl } from '@/hooks/use-blur-hash'
import customImageLoader from '@/image-loader'
import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Media } from '@/types/Media'
import Image from 'next/image'

type Props = {
  media: Media
  unoptimized?: boolean
  className?: string
}

const CardImage = ({ media, unoptimized, className }: Props) => {
  const { blurhash, width, height } = media

  const blurDataUrl = useBlurDataUrl(blurhash, width, height)

  return (
    <Image
      data-test-id={'card-image'}
      sizes={'(max-width: 768px) 30vw, (max-width: 1280px) 20vw, 15vw'}
      loader={customImageLoader}
      src={
        media.thumbnail ||
        (media.type === 'image' ? media.url : siteConfig.mediaErrorUrl) ||
        siteConfig.mediaErrorUrl
      }
      alt={'card media thumbnail'}
      width={media.width || 1024}
      height={media.height || 1024}
      blurDataURL={blurDataUrl}
      placeholder={blurDataUrl ? 'blur' : undefined}
      className={cn(['w-full h-full', className])}
      unoptimized={unoptimized}
    />
  )
}

export default CardImage

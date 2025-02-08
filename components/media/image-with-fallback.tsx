import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import { SyntheticEvent, useEffect, useState } from 'react'
import React from 'react'

type Props = ImageProps & {
  fallbackImage?: string
}

const ImageWithFallback = ({
  fallbackImage = 'https://d14i3advvh2bvd.cloudfront.net/app/android-chrome-512x512.png',
  alt,
  src,
  className,
  ...props
}: Props) => {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement> | null>(
    null,
  )

  useEffect(() => {
    setError(null)
  }, [src])

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallbackImage : src}
      className={cn([className, error ? '!top-[5%] p-[20%]' : ''])}
      {...props}
    />
  )
}

export default ImageWithFallback

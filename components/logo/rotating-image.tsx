import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import { FC } from 'react'

interface RotatingImageProps extends ImageProps {}

export const RotatingImage: FC<RotatingImageProps> = ({
  src,
  alt,
  priority,
  className,
}) => {
  return (
    <>
      <style>
        {`
        .rotate {
          animation: rotate 5s linear infinite;
        }

        @keyframes rotate {
              from {
                  transform: rotate3d(0, 1, 0, 0deg);
              }
              to {
                  transform: rotate3d(0, 1, 0, 360deg);
              }
            }
        `}
      </style>

      <Image
        className={cn(
          'relative w-full h-auto drop-shadow-[0_0_0.3rem_#00000070] dark:drop-shadow-[0_0_0.3rem_#ffffff70] invert dark:invert-0 rotate',
          className,
        )}
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        priority={priority}
      />
    </>
  )
}

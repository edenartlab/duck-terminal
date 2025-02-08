import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
  width?: number
  height?: number
}

export const EdenLogoBw: FC<Props> = ({ width, height, className }) => {
  return (
    <Image
      width={width || 0}
      height={height || 0}
      sizes={'100vw'}
      src="/android-chrome-512x512.png"
      alt="Eden Logo"
      className={cn('relative w-[40px] h-auto invert dark:invert-0', className)}
      priority={true}
    />
  )
}

export default EdenLogoBw

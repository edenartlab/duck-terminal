import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
  width?: number
  height?: number
}

export const EdenLogoWithTextBw: FC<Props> = ({ width, height, className }) => {
  return (
    <Image
      width={width || 0}
      height={height || 0}
      sizes={'100vw'}
      src="/eden-logo-with-text.png"
      alt="Eden Logo"
      className={cn('relative w-[96px] h-auto invert dark:invert-0', className)}
      priority={true}
    />
  )
}

export default EdenLogoWithTextBw

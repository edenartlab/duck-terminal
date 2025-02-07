import { cn } from '@/lib/utils'
import { HTMLProps, PropsWithChildren } from 'react'

const TypographyH6 = ({
  className,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLHeadingElement>) => {
  return (
    <h6
      className={cn('scroll-m-20 font-semibold tracking-tight', className)}
      {...rest}
    />
  )
}

export default TypographyH6

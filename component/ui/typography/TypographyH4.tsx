import { cn } from '@/lib/utils'
import { HTMLProps, PropsWithChildren } from 'react'

const TypographyH4 = ({
  className,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLHeadingElement>) => {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...rest}
    />
  )
}

export default TypographyH4

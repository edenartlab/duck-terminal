import { cn } from '@/lib/utils'
import { HTMLProps, PropsWithChildren } from 'react'

const TypographyH5 = ({
  className,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLHeadingElement>) => {
  return (
    <h5
      className={cn(
        'scroll-m-20 text-lg font-semibold tracking-tight',
        className,
      )}
      {...rest}
    />
  )
}

export default TypographyH5

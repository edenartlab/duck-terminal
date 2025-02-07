import { cn } from '@/lib/utils'
import { HTMLProps, PropsWithChildren } from 'react'

const TypographyH3 = ({
  className,
  ...rest
}: PropsWithChildren & HTMLProps<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight mb-4',
        className,
      )}
      {...rest}
    />
  )
}

export default TypographyH3

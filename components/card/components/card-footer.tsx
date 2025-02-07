import { PropsWithChildren, ReactNode } from 'react'

type Props = {
  actions?: ReactNode
} & PropsWithChildren

const CardFooter = ({ actions, children }: Props) => {
  return (
    <div className="relative z-10 flex items-center justify-between h-11 bg-muted text-muted-foreground pl-2 px-1">
      <div className="h-7 sm:h-9 w-full flex justify-between items-center">
        {children}
        <div className="ml-auto flex gap-1">{actions}</div>
      </div>
    </div>
  )
}

export default CardFooter

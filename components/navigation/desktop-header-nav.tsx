import { PropsWithChildren } from 'react'

const DesktopHeaderNav = ({ children }: PropsWithChildren) => {
  return (
    <nav className="hidden flex-col w-full items-stretch gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-2 md:text-sm">
      {children}
    </nav>
  )
}

export default DesktopHeaderNav

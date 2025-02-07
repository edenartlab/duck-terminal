'use client'

// import DesktopSecondaryNav from '@/components/navigation/desktop-secondary-nav'
import MobileSecondaryNav from '@/components/navigation/mobile-secondary-nav'
import { SecondaryNavSection } from '@/components/navigation/secondary-nav-links'

// import { useMediaQuery } from '@/hooks/use-media-query'

type Props = {
  title?: string
  baseSegment: string
  items: SecondaryNavSection[]
}
const SecondaryNav = ({ title, baseSegment, items }: Props) => {
  // const isDesktop = useMediaQuery('(min-width: 768px)')

  // return isDesktop ? null : (
  //   <MobileSecondaryNav baseSegment={baseSegment} items={items} title={title} />
  // )

  return (
    <MobileSecondaryNav baseSegment={baseSegment} items={items} title={title} />
  )
}

export default SecondaryNav

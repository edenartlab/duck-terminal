'use client'

import EdenLogoBw from '@/components/logo/eden-logo-bw'
import { NavLinkProps } from '@/components/navigation/nav-link'
import NavLinkList from '@/components/navigation/nav-link-list'
import { Separator } from '@/components/ui/separator'
import Link, { LinkProps } from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { PropsWithChildren } from 'react'

const HomeNavLink = ({ ...rest }: PropsWithChildren & LinkProps) => {
  return (
    <Link
      className="relative flex items-center gap-2 text-lg font-semibold md:text-base mr-2"
      {...rest}
    >
      <EdenLogoBw />
      <span className="sr-only">Eden2.0</span>
    </Link>
  )
}

const navItemsExplore: NavLinkProps[] = [
  {
    label: 'Explore',
    segments: ['explore'],
  },
]

const navItemsMake: NavLinkProps[] = [
  {
    label: 'Create',
    segments: ['create'],
  },
]

const navItemsTrain: NavLinkProps[] = [
  {
    label: 'Train Models',
    segments: ['train'],
  },
]

const navItemsEve: NavLinkProps[] = [
  {
    label: 'Eve',
    segments: [`chat/eve`],
  },
]

type Props = {
  inSheet?: boolean
}

const HeaderNavLinks = ({ inSheet }: Props) => {
  const segments = useSelectedLayoutSegments()

  return (
    <>
      <HomeNavLink href="/" />
      <NavLinkList items={navItemsMake} segments={segments} inSheet={inSheet} />
      <div className="md:self-stretch md:flex md:items-center">
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator orientation="horizontal" className="md:hidden" />
      </div>
      <NavLinkList
        items={navItemsTrain}
        segments={segments}
        inSheet={inSheet}
      />
      <div className="md:self-stretch md:flex md:items-center">
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator orientation="horizontal" className="md:hidden" />
      </div>
      <NavLinkList
        items={navItemsExplore}
        segments={segments}
        inSheet={inSheet}
      />
      <div className="md:self-stretch md:flex md:items-center">
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator orientation="horizontal" className="md:hidden" />
      </div>
      <NavLinkList items={navItemsEve} segments={segments} inSheet={inSheet} />
    </>
  )
}

export default HeaderNavLinks

'use client'

import LoadingIndicator from '@/components/loading-indicator'
import { SecondaryNavSection } from '@/components/navigation/secondary-nav-links'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import TypographyH6 from '@/components/ui/typography/TypographyH6'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { Suspense } from 'react'

// import { useSelectedLayoutSegments } from 'next/navigation'

type Props = {
  title?: string
  baseSegment: string
  items: SecondaryNavSection[]
}

const MobileSecondaryNav = ({ title, baseSegment, items }: Props) => {
  return (
    <div className="relative flex px-1 items-center bg-muted-darker z-20 md:sticky md:top-16 drop-shadow-lg">
      <NavigationMenu>
        {title ? (
          <Link href={`/${baseSegment}`} className="p-4 px-2 mr-2">
            <TypographyH6 className="text-accent-foreground">
              {title}
            </TypographyH6>
          </Link>
        ) : undefined}
        <NavigationMenuList className="space-x-2">
          {items.map(item => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger className="relative !z-0">
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className={'max-h-[calc(100dvh_-_126px)] overflow-y-scroll'}
              >
                <Suspense fallback={<LoadingIndicator />}>
                  <ul className="grid gap-3 p-4 w-[350px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {item.links.map(link => (
                      <ListItem
                        key={`/${link.segments.join('/')}`}
                        href={`/${link.segments.join('/')}`}
                        title={link.label}
                      >
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </Suspense>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          <NavigationMenuIndicator />
        </NavigationMenuList>

        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, href, title, children, ...props }, ref) => {
  const pathname = usePathname()
  const isActive = href === pathname

  return (
    <li>
      <NavigationMenuLink
        asChild
        active={isActive}
        className={cn([
          navigationMenuTriggerStyle(),
          'flex flex-col items-start h-auto w-full',
        ])}
      >
        <Link
          prefetch={false}
          href={href || ''}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-1 md:line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

export default MobileSecondaryNav

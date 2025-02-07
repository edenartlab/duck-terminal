'use client'

import { NavLinkProps } from '@/components/navigation/nav-link'
import NavLinkList from '@/components/navigation/nav-link-list'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSelectedLayoutSegments } from 'next/navigation'

export type SecondaryNavSection = {
  title: string
  links: NavLinkProps[]
}

export type SecondaryNavProps = {
  baseSegment: string
  items: SecondaryNavSection[]
}

const SecondaryNavLinks = ({ items, baseSegment }: SecondaryNavProps) => {
  const partialSegments = useSelectedLayoutSegments()
  const segments = baseSegment
    ? [baseSegment, ...partialSegments]
    : partialSegments

  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion type="single" collapsible defaultValue={items[0].title}>
        {items.map(item => (
          <AccordionItem
            key={item.title}
            className="flex flex-col gap-1"
            value={item.title}
          >
            <AccordionTrigger className="px-4 font-bold text-accent-foreground w-full">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1 px-4">
              <NavLinkList items={item.links} segments={segments} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default SecondaryNavLinks

import SecondaryNav from '@/components/navigation/secondary-nav'
import { SecondaryNavSection } from '@/components/navigation/secondary-nav-links'
import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  title?: string
  baseSegment: string
  navigation: SecondaryNavSection[]
  wrapClassName?: string
}

const SecondaryNavLayout = ({
  children,
  title,
  navigation,
  baseSegment,
  wrapClassName,
}: Props) => {
  return (
    <div className="min-h-[calc(100vh_-_theme(spacing.16))] bg-background">
      <SecondaryNav
        title={title}
        baseSegment={baseSegment}
        items={navigation}
      />
      <main
        className={cn([
          'flex flex-1 flex-col gap-4 p-2 pt-0 md:p-4 md:pt-0',
          wrapClassName,
        ])}
      >
        {children}
      </main>
    </div>
  )
}

export default SecondaryNavLayout

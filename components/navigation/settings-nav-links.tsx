'use client'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SettingsNavLinks = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      <div className="flex flex-col gap-2 text-foreground/90">
        <div className="text-muted-foreground font-bold text-xs">General</div>
        <Link
          href="/settings/account"
          className={cn(
            'px-2 py-1.5 rounded-md',
            isActive('/settings/account') && 'bg-muted/50 text-foreground',
            '[@media(pointer:fine)]:hover:bg-accent/75 hover:text-popover-foreground',
          )}
        >
          Account
        </Link>
        <Link
          href="/settings/integrations"
          className={cn(
            'px-2 py-1.5 rounded-md',
            isActive('/settings/integrations') && 'bg-muted/50 text-foreground',
            '[@media(pointer:fine)]:hover:bg-accent/75 hover:text-popover-foreground',
          )}
        >
          Integrations
        </Link>
        <Link
          href="/settings/subscription"
          className={cn(
            'px-2 py-1.5 rounded-md',
            isActive('/settings/subscription') && 'bg-muted/50 text-foreground',
            '[@media(pointer:fine)]:hover:bg-accent/75 hover:text-popover-foreground',
          )}
        >
          Subscription
        </Link>
      </div>

      <div className="flex flex-col gap-2 text-foreground/90">
        <div className="text-muted-foreground font-bold text-xs">
          Developers
        </div>
        <Link
          href="/settings/api"
          className={cn(
            'px-2 py-1.5 rounded-md',
            isActive('/settings/api') && 'bg-muted/50 text-foreground',
            '[@media(pointer:fine)]:hover:bg-accent/75 hover:text-popover-foreground',
          )}
        >
          API Keys
        </Link>
      </div>
      <Separator orientation="horizontal" className="md:hidden" />
    </>
  )
}

export default SettingsNavLinks

import DiscordIcon from '@/components/icons/discord'
import TwitterIcon from '@/components/icons/twitter'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { FC } from 'react'
import * as React from 'react'

export const Footer: FC = () => {
  return (
    <div className="flex items-center justify-center w-full bg-accent py-2 px-4">
      <div className="w-full max-w-3xl flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size={'icon'} asChild>
            <Link
              href={siteConfig.links.discord}
              target="_blank"
              className="filter grayscale hover:grayscale-0"
            >
              <DiscordIcon size={20} />
            </Link>
          </Button>
          <Button variant="ghost" size={'icon'} asChild>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              className="group grayscale hover:grayscale-0 hover:text-white"
            >
              <TwitterIcon
                size={18}
                className="brightness-50 group-hover:!brightness-100"
              />
            </Link>
          </Button>
        </div>

        <Link
          className="text-xs hover:underline text-muted-foreground"
          href={`https://docs.eden.art/docs/overview/tos`}
          prefetch={false}
        >
          <span>Terms</span>
        </Link>
      </div>
    </div>
  )
}

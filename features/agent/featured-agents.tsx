'use client'

import { AgentGridSection } from '@/features/tools/agent-grid-section'
import { siteConfig } from '@/lib/config'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

export const FeaturedAgents = () => {
  return (
    <div className="p-2 md:p-4 pt-3 mt-4 rounded-lg bg-muted-darker">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>Agents</div>
        <Link
          title="Explore agent feed"
          href="/explore?tab=agents"
          className="text-muted-foreground flex items-center gap-0.5 hover:text-foreground  group transition-colors duration-200"
          prefetch={false}
        >
          Explore more
          <ChevronRightIcon className="w-4 h-4 transform  group-hover:scale-110" />
        </Link>
      </div>
      <AgentGridSection agentIds={siteConfig.featured.agents} />
    </div>
  )
}

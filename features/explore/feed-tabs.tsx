'use client'

import RouterTabs, { RouterTab } from '@/components/tabs/router-tabs'
import AgentsFeed from '@/features/feed/agents-feed'
import CreationsFeed from '@/features/feed/creations-feed'
import ModelsFeed from '@/features/feed/models-feed'
import { ClockArrowDownIcon, StarIcon } from 'lucide-react'

const FeedTabs = () => {
  const creationsBaseQuery = process.env.NEXT_PUBLIC_EDEN_FEATURED_COLLECTION_ID
    ? {
        collection: process.env.NEXT_PUBLIC_EDEN_FEATURED_COLLECTION_ID,
      }
    : undefined

  const tabs: RouterTab[] = [
    {
      key: 'creations',
      title: 'Creations',
      content: <CreationsFeed query={creationsBaseQuery} maxCols={7} />,
      filterOptions: [
        {
          label: 'Featured',
          value: 'featured',
          icon: <StarIcon className="h-3 w-3 mr-2" />,
          query: creationsBaseQuery,
        },
        {
          label: 'Latest',
          value: 'latest',
          icon: <ClockArrowDownIcon className="h-3 w-3 mr-2" />,
          query: {},
        },
      ],
    },
    {
      key: 'models',
      title: 'Models',
      content: (
        <ModelsFeed
          minCols={1}
          maxCols={5}
          breakpoints={[
            { minWidth: 1536, columns: 5 },
            { minWidth: 1280, columns: 4 },
            { minWidth: 640, columns: 2 },
            { minWidth: 0, columns: 1 },
          ]}
        />
      ),
    },
    {
      key: 'agents',
      title: 'Agents',
      content: (
        <AgentsFeed
          minCols={1}
          maxCols={3}
          breakpoints={[
            { minWidth: 1280, columns: 3 },
            { minWidth: 640, columns: 2 },
            { minWidth: 0, columns: 1 },
          ]}
        />
      ),
    },
  ]

  return <RouterTabs tabs={tabs} />
}

export default FeedTabs

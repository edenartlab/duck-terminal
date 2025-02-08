'use client'

import RouterTabs, { RouterTab } from '@/components/tabs/router-tabs'
import AgentsFeed from '@/features/feed/agents-feed'
import CollectionsFeed from '@/features/feed/collections-feed'
import CreationsFeed from '@/features/feed/creations-feed'
import ModelsFeed from '@/features/feed/models-feed'
import { useCreatorQuery } from '@/hooks/query/use-creator-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { LockClosedIcon } from '@radix-ui/react-icons'
import { LockOpenIcon } from 'lucide-react'
import { useParams } from 'next/navigation'

const ProfileTabs = () => {
  const params = useParams<{ name: string }>()
  const { user, isSignedIn } = useAuthState()
  const { creator } = useCreatorQuery({ key: params.name })

  if (!creator || (isSignedIn && !user)) {
    return null
  }

  const baseQuery = {
    user: creator._id,
  }

  const isOwnProfile = user?._id === creator._id

  const globalFilterOptions = isOwnProfile
    ? [
        {
          label: 'All',
          value: 'all',
          query: baseQuery,
        },
        {
          label: 'Private',
          value: 'private',
          icon: <LockClosedIcon className="h-3 w-3 mr-2" />,
          query: {
            ...baseQuery,
            isPrivate: true,
          },
        },
        {
          label: 'Public',
          value: 'public',
          icon: <LockOpenIcon className="h-3 w-3 mr-2" />,
          query: {
            ...baseQuery,
            isPrivate: false,
          },
        },
      ]
    : undefined

  const tabs: RouterTab[] = [
    {
      key: 'creations',
      title: 'Creations',
      content: (
        <CreationsFeed
          query={baseQuery}
          maxCols={7}
          multiselect={isOwnProfile}
        />
      ),
    },
    {
      key: 'models',
      title: 'Models',
      content: <ModelsFeed query={baseQuery} minCols={1} maxCols={4} />,
    },
    {
      key: 'collections',
      title: 'Collections',
      content: <CollectionsFeed query={baseQuery} />,
    },
    {
      key: 'agents',
      title: 'Agents',
      content: <AgentsFeed query={baseQuery} minCols={1} maxCols={2} />,
    },
  ]

  return (
    <RouterTabs
      tabs={tabs}
      globalFilterOptions={globalFilterOptions}
      baseQuery={baseQuery}
    />
  )
}

export default ProfileTabs

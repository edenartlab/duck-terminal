'use client'

import CollectionCard from '@/components/card/collection-card'
import MasonryVirtualizerVertical from '@/components/masonry/masonry-virtualizer-vertical'
import { RowItem } from '@/lib/query/cache-updates'
import {
  CollectionV2,
  FeedCollectionsV2CursorArguments,
} from '@edenlabs/eden-sdk'
import { useMemo } from 'react'

type Props = {
  query?: FeedCollectionsV2CursorArguments
  minCols?: number
  maxCols?: number
}

const CollectionsFeed = ({ query: queryProp, minCols, maxCols }: Props) => {
  const defaultQuery: FeedCollectionsV2CursorArguments = useMemo(
    () => ({
      limit: 35,
      sort: ['createdAt;-1'],
    }),
    [],
  )

  const query = useMemo(() => {
    return { ...defaultQuery, ...queryProp }
  }, [defaultQuery, queryProp])

  const queryKey = useMemo(() => ['collections', query], [query])

  return (
    <MasonryVirtualizerVertical
      key={JSON.stringify(queryKey)}
      apiEndpoint={'/api/feed/collections'}
      queryKey={queryKey}
      query={query}
      minCols={minCols || 2}
      maxCols={maxCols || undefined}
      render={(item: RowItem) => (
        <CollectionCard collection={item as CollectionV2} queryKey={queryKey} />
      )}
    />
  )
}

export default CollectionsFeed

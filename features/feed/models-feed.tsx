'use client'

import ModelCard from '@/components/card/model-card'
import MasonryVirtualizerVertical, {
  BreakpointConfig,
} from '@/components/masonry/masonry-virtualizer-vertical'
import { RowItem } from '@/lib/query/cache-updates'
import { FeedConceptsCursorArguments, ModelV2 } from '@edenlabs/eden-sdk'
import { useMemo } from 'react'

type Props = {
  query?: FeedConceptsCursorArguments
  minCols?: number
  maxCols?: number
  breakpoints?: BreakpointConfig[]
  onClick?: (item: ModelV2) => void
  showFooterItems?: {
    name: boolean
    actions: boolean
  }
}

const ModelsFeed = ({
  query: queryProp,
  minCols,
  maxCols,
  breakpoints,
  onClick,
  showFooterItems,
}: Props) => {
  const defaultQuery: FeedConceptsCursorArguments = useMemo(
    () => ({
      limit: 35,
      sort: ['createdAt;-1'],
    }),
    [],
  )

  const query = useMemo(() => {
    return { ...defaultQuery, ...queryProp }
  }, [defaultQuery, queryProp])

  const queryKey = useMemo(() => ['models', query], [query])

  return (
    <MasonryVirtualizerVertical
      key={JSON.stringify(queryKey)}
      apiEndpoint={'/api/feed/models'}
      queryKey={queryKey}
      query={query}
      minCols={minCols || 2}
      maxCols={maxCols || undefined}
      breakpoints={breakpoints}
      render={(item: RowItem) => (
        <ModelCard
          onClick={onClick}
          queryKey={queryKey}
          model={item as ModelV2}
          creator={(item as ModelV2).user}
          linkHref={`/models/${item._id}`}
          showFooterItems={showFooterItems}
        />
      )}
    />
  )
}

export default ModelsFeed

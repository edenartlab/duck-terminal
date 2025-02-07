'use client'

import ErrorBoundary from '@/components/error-boundary'
import LoadingIndicator from '@/components/loading-indicator'
import { MasonrySkeleton } from '@/components/masonry/masonry-virtualizer-vertical'
import CreationMediaPreview from '@/components/media/creation-media-preview'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatarLink from '@/components/user/user-avatar-link'
import DetailSidebar from '@/features/detail/detail-sidebar'
import CreationsFeed from '@/features/feed/creations-feed'
import { useCreationQuery } from '@/hooks/query/use-creation-query'
import { cn } from '@/lib/utils'
import { CreationV2 } from '@edenlabs/eden-sdk'
import React, { Suspense, useEffect, useRef, useState } from 'react'

type Props = {
  id: string
  creationSSRData?: CreationV2
  isModal?: boolean
}

const CreationDetail = ({ id, creationSSRData, isModal }: Props) => {
  const { creation: creationClientData, queryKey } = useCreationQuery({
    key: id,
    initialData: creationSSRData
      ? {
          creation: creationSSRData,
        }
      : undefined,
  })
  // console.log({ id, creationClientData, creationSSRData, queryKey })

  const creation = creationClientData || creationSSRData

  const [shouldRenderRecentCreations, setShouldRenderRecentCreations] =
    useState(false)
  const observedRef = useRef<HTMLDivElement>(null)

  // console.log({ shouldRenderRecentCreations, ref: observedRef.current })

  useEffect(() => {
    let observer: IntersectionObserver

    if (observedRef.current) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setShouldRenderRecentCreations(true)
            }
          })
        },
        { threshold: 0.1 },
      )

      observer.observe(observedRef.current)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [observedRef, creation?.user])

  return (
    <>
      <div
        className={cn([
          `w-full flex flex-col flex-grow lg:flex-row lg:gap-4 max-h-full lg:ml-4`,
          isModal
            ? 'lg:h-[calc(100vh_-_34px)] lg:w-[calc(100dvw_-_48px)]'
            : 'lg:h-[calc(100vh_-_64px)] lg:w-[calc(100dvw_-_32px)]',
        ])}
      >
        {creation ? (
          <CreationMediaPreview creation={creation} isModal={isModal} />
        ) : (
          <Skeleton className="min-h-[512px] w-full rounded-xl opacity-0 animate-fade-in" />
        )}

        <Suspense fallback={<LoadingIndicator />}>
          <ErrorBoundary>
            <DetailSidebar
              item={creation}
              type={'creation'}
              inModal={isModal}
              queryKey={queryKey}
            />
          </ErrorBoundary>
        </Suspense>
      </div>
      <div>
        <div className="px-4 w-full">
          {creation ? (
            <>
              <div className="flex text-sm items-center gap-2 justify-center mb-2 pt-16 pb-8 lg:pt-24 lg:pb-12">
                Recent creations from
                <UserAvatarLink
                  name={creation.user.username || creation.user._id}
                  image={creation.user.userImage}
                />
              </div>
              <div
                ref={observedRef}
                className="lg:max-w-[80%] 2xl:max-w-[70%] mx-auto pb-12"
              >
                {shouldRenderRecentCreations ? (
                  <Suspense fallback={<MasonrySkeleton />}>
                    <ErrorBoundary>
                      <CreationsFeed
                        query={{ user: creation.user._id }}
                        maxCols={5}
                      />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default CreationDetail

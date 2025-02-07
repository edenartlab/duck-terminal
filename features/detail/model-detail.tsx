'use client'

import ErrorBoundary from '@/components/error-boundary'
import LoadingIndicator from '@/components/loading-indicator'
import { MasonrySkeleton } from '@/components/masonry/masonry-virtualizer-vertical'
import ModelMediaPreview from '@/components/media/model-media-preview'
import { Skeleton } from '@/components/ui/skeleton'
import DetailSidebar from '@/features/detail/detail-sidebar'
import CreationsFeed from '@/features/feed/creations-feed'
import { useModelQuery } from '@/hooks/query/use-model-query'
import { cn } from '@/lib/utils'
import { ModelV2 } from '@edenlabs/eden-sdk'
import React, { Suspense, useEffect, useRef, useState } from 'react'

type Props = {
  id: string
  modelSSRData?: ModelV2
  isModal?: boolean
}

const ModelDetail = ({ id, modelSSRData, isModal }: Props) => {
  const { model: modelClientData, queryKey } = useModelQuery({
    key: id,
    initialData: modelSSRData
      ? {
          model: modelSSRData,
        }
      : undefined,
  })

  const model = modelClientData || modelSSRData

  console.log({ model })

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
  }, [observedRef, model?._id])

  return (
    <>
      <div
        className={cn([
          `w-full flex flex-col flex-grow lg:flex-row lg:gap-4 max-h-full lg:ml-4`,
          isModal
            ? 'lg:h-[calc(100vh_-_34px)] lg:w-[calc(100dvw_-_48px)]'
            : 'lg:h-[calc(100vh_-_64px)] lg:w-[calc(100dvw_-_16px)]',
        ])}
      >
        {model ? (
          <ModelMediaPreview model={model} isModal={isModal} />
        ) : (
          <Skeleton className="min-h-[512px] w-full rounded-xl opacity-0 animate-fade-in" />
        )}

        <Suspense fallback={<LoadingIndicator />}>
          <ErrorBoundary>
            <DetailSidebar
              item={model}
              type={'model'}
              inModal={isModal}
              queryKey={queryKey}
            />
          </ErrorBoundary>
        </Suspense>
      </div>
      <div>
        <div className="px-4 w-full">
          {model ? (
            <>
              <div className="flex text-sm items-center gap-2 justify-center mb-2 pt-16 pb-8 lg:pt-24 lg:pb-12">
                Recent creations using this model
              </div>
              <div
                ref={observedRef}
                className="lg:max-w-[80%] 2xl:max-w-[70%] mx-auto pb-12"
              >
                {shouldRenderRecentCreations ? (
                  <Suspense fallback={<MasonrySkeleton />}>
                    <ErrorBoundary>
                      <CreationsFeed
                        query={{ concept: model._id }}
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

export default ModelDetail

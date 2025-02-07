'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useModelQuery } from '@/hooks/query/use-model-query'
import customImageLoader from '@/image-loader'
import { ErrorName } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { ModelV2 } from '@edenlabs/eden-sdk'
import { CircleAlertIcon, LockIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { PropsWithChildren, useMemo } from 'react'

type Props = {
  modelId: ModelV2['_id']
  className?: string
} & PropsWithChildren

const ModelMiniCard = ({ modelId, children, className }: Props) => {
  const pathname = usePathname()

  const { model, isLoading, isError, error } = useModelQuery({
    key: modelId,
    enabled: !!modelId,
    retry: false,
  })

  const wrapperClass = useMemo(
    () =>
      cn([
        'relative flex gap-2 items-center bg-accent border border-border rounded-lg p-2 min-h-16 overflow-hidden',
        className,
      ]),
    [className],
  )

  if (!modelId) {
    return null
  }

  if (isLoading) {
    return (
      <div className={wrapperClass}>
        <Skeleton className="h-16 w-16 max-w-16 flex-shrink-0" />
        <div className="text-xs flex flex-col h-full w-full space-y-0.5 mr-2 justify-center">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    )
  }

  if (isError && error?.name === ErrorName.UNAUTHORIZED) {
    return (
      <>
        <div className={wrapperClass}>
          <div className="size-8 flex items-center justify-center bg-accent rounded-sm border border-border">
            <LockIcon className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold">Model is private</p>
        </div>
        {pathname.startsWith('/create') && (
          <div className="text-warning text-sm flex items-center gap-x-2 mt-2">
            <CircleAlertIcon size={16} className="flex-shrink-0" />
            <p>
              You do not have permission to use this model. Please select a
              different model or this parameter will be ignored.
            </p>
          </div>
        )}
      </>
    )
  }

  if (!model) {
    return null
  }

  return (
    <div className={wrapperClass}>
      <Link
        href={`/models/${model._id}`}
        prefetch={false}
        shallow={true}
        className="size-16"
      >
        <Image
          className="max-w-16"
          loader={customImageLoader}
          src={model?.thumbnail}
          alt={model?.name}
          width={64}
          height={64}
        />
        {model.deleted && (
          <div className="absolute inset-0 z-10 bg-accent/70 drop-shadow size-16 mt-2 ml-2 flex items-center justify-center">
            <div className="p-1 bg-destructive/50 text-destructive-foreground text-xs rounded-sm backdrop-blur-[2px]">
              deleted
            </div>
          </div>
        )}
      </Link>
      <div className="text-xs flex flex-col justify-around h-full w-full py-1">
        <Link href={`/models/${model._id}`} prefetch={false}>
          <div className="flex">
            {model.name}
            {model.task.args.concept_mode && (
              <Badge className="ml-2 h-4 px-2" variant="outline">
                {model.task.args.concept_mode}
              </Badge>
            )}
          </div>
        </Link>
        <div className="text-muted-foreground flex gap-2">
          <div>
            by
            <Link
              href={`/creators/${model.user.username}`}
              className="ml-1 font-bold"
              prefetch={false}
            >
              {model.user.username}
            </Link>
          </div>
        </div>
      </div>
      {!model.deleted && children}
    </div>
  )
}

export default ModelMiniCard

'use client'

import ErrorBoundary from '@/components/error-boundary'
import Timeline from '@/components/timeline/timeline'
import { Skeleton } from '@/components/ui/skeleton'
import CreationUiContainer from '@/features/tools/creation-ui-container'
import { useToolQuery } from '@/hooks/query/use-tool-query'
import { ToolV2 } from '@edenlabs/eden-sdk'
import { Suspense } from 'react'

type Props = {
  toolKey: ToolV2['key']
  toolSSRData?: ToolV2
}

const Workspace = ({ toolKey, toolSSRData }: Props) => {
  const { tool: toolClientData } = useToolQuery({
    key: toolKey,
    initialData: toolSSRData
      ? {
          tool: toolSSRData,
        }
      : undefined,
  })
  // console.log({ toolKey, toolSSRData, toolClientData })

  const tool = toolClientData || toolSSRData

  if (!tool) {
    return null
  }

  return (
    <div data-test-id="workspace" className="flex flex-col lg:flex-row">
      <div className="lg:pr-4 lg:sticky lg:top-[120px] lg:h-screen min-w-[324px] w-full lg:max-w-[420px] lg:pt-4">
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <ErrorBoundary>
            <CreationUiContainer tool={tool} />
          </ErrorBoundary>
        </Suspense>
      </div>

      <div className="mb-8 lg:pt-4 flex flex-col gap-y-4 w-full">
        <Suspense>
          <ErrorBoundary>
            <Timeline tool={tool} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  )
}

export default Workspace

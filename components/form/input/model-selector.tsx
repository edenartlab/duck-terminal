'use client'

import ModelMiniCard from '@/components/card/model-mini-card'
import LoadingIndicator from '@/components/loading-indicator'
import ModelSelectorModal from '@/components/modal/model-selector-modal'
import { Button } from '@/components/ui/button'
import { BaseModelName } from '@edenlabs/eden-sdk'
import { X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

type Props = {
  base_model?: BaseModelName | BaseModelName[]
  onChange: (newVal: string | undefined) => void
  value: string
}

const ModelSelector = ({ base_model, onChange, value }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const queryParams = useSearchParams()

  const handleRemoveModelSelection = () => {
    if (queryParams && queryParams.get('lora')) {
      router.push(pathname, { scroll: false })
    }

    onChange('')
  }

  return (
    <div>
      {value ? (
        <Suspense fallback={<LoadingIndicator />}>
          <ModelMiniCard modelId={value}>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto mr-2"
              onClick={handleRemoveModelSelection}
            >
              <X size={20} />
            </Button>
          </ModelMiniCard>
        </Suspense>
      ) : null}

      <ModelSelectorModal
        className="p-4 md:p-8 w-full"
        title="Select model"
        description="Pick a model to use as a lora"
        base_model={base_model}
        currentValue={value}
        onChange={onChange}
      />
    </div>
  )
}

export default ModelSelector

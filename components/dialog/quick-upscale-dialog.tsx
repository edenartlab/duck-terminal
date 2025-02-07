'use client'

import QuickCreateForm from '@/components/dialog/quick-create-form'
import DialogContentOverlayBlur from '@/components/ui/custom/dialog-content-overlay-blur'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { useQuickUpscaleModal } from '@/stores/dialogs/dialogs.selector'
import { updateQuickUpscaleModal } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import React, { Suspense, useCallback } from 'react'

const FormSkeleton = () => {
  return (
    <div className="p-4 min-h-[204px] flex flex-col">
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-[84px] w-full mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

const QuickUpscaleDialog = () => {
  const dispatch = useAppDispatch()
  const quickUpscaleModal = useQuickUpscaleModal()
  const handleQuickUpscaleModalOpenChange = useCallback(() => {
    dispatch(updateQuickUpscaleModal({ isOpen: !quickUpscaleModal.isOpen }))
  }, [dispatch, quickUpscaleModal.isOpen])

  if (!quickUpscaleModal.creation) {
    return null
  }

  return (
    <>
      <Dialog
        open={quickUpscaleModal.isOpen}
        onOpenChange={handleQuickUpscaleModalOpenChange}
      >
        <DialogContentOverlayBlur className="max-w-[calc(100vw-32px)] sm:max-w-lg">
          <DialogTitle>Quick Upscale</DialogTitle>
          <Suspense fallback={<FormSkeleton />}>
            <QuickCreateForm
              toolKey={'upscaler'}
              exposedParameters={['longest_side']}
              initValues={{
                init_image:
                  getCloudfrontOriginalUrl(
                    quickUpscaleModal.creation.filename,
                  ) || '',
              }}
              onSubmitSuccess={() =>
                dispatch(updateQuickUpscaleModal({ isOpen: false }))
              }
            />
          </Suspense>
        </DialogContentOverlayBlur>
      </Dialog>
    </>
  )
}

export default QuickUpscaleDialog

'use client'

import QuickCreateForm from '@/components/dialog/quick-create-form'
import DialogContentOverlayBlur from '@/components/ui/custom/dialog-content-overlay-blur'
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { useQuickAnimateModal } from '@/stores/dialogs/dialogs.selector'
import { updateQuickAnimateModal } from '@/stores/dialogs/dialogs.slice'
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

const QuickAnimateDialog = () => {
  const dispatch = useAppDispatch()
  const quickAnimateModal = useQuickAnimateModal()
  const handleQuickAnimateModalOpenChange = useCallback(() => {
    dispatch(updateQuickAnimateModal({ isOpen: !quickAnimateModal.isOpen }))
  }, [dispatch, quickAnimateModal.isOpen])

  if (!quickAnimateModal.creation) {
    return null
  }

  const tabs = [
    {
      key: 'animate_3D',
      title: 'Animate 3D',
      content: (
        <Suspense fallback={<FormSkeleton />}>
          <QuickCreateForm
            toolKey={'animate_3D'}
            exposedParameters={['n_seconds']}
            initValues={{
              image:
                getCloudfrontOriginalUrl(quickAnimateModal.creation.filename) ||
                '',
            }}
            onSubmitSuccess={() =>
              dispatch(updateQuickAnimateModal({ isOpen: false }))
            }
          />
        </Suspense>
      ),
    },
  ]

  return (
    <>
      <Dialog
        open={quickAnimateModal.isOpen}
        onOpenChange={handleQuickAnimateModalOpenChange}
      >
        <DialogContentOverlayBlur className="max-w-[calc(100vw-32px)] sm:max-w-lg">
          <DialogTitle>Quick Animate</DialogTitle>
          <DialogDescription>Animate an image with...</DialogDescription>
          <Tabs defaultValue={tabs[0].key} className="w-full max-w-full">
            <TabsList className="flex justify-stretch rounded-b-none">
              {tabs.map(tab => (
                <TabsTrigger key={tab.key} value={tab.key} className="w-full">
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map(tab => (
              <TabsContent
                key={tab.key}
                value={tab.key}
                className="mt-0 min-h-[204px] border border-secondary border-t-0 rounded-md rounded-t-none"
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </DialogContentOverlayBlur>
      </Dialog>
    </>
  )
}

export default QuickAnimateDialog

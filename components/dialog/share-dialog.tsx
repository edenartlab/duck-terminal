'use client'

import TwitterIcon from '@/components/icons/twitter'
import { Button } from '@/components/ui/button'
import DialogContentOverlayBlur from '@/components/ui/custom/dialog-content-overlay-blur'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useShareModal } from '@/stores/dialogs/dialogs.selector'
import { updateShareModal } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { CopyIcon, MoreHorizontalIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const ShareButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) => {
  return (
    <Button
      className="flex sm:flex-col sm:w-full sm:h-auto sm:py-4 items-center justify-center gap-2"
      variant="outline"
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  )
}

const ShareDialog = () => {
  const dispatch = useAppDispatch()
  const shareModal = useShareModal()

  const encodedText = React.useMemo(() => {
    if (shareModal.isOpen) {
      return encodeURIComponent('Check on Eden')
    }
    return ''
  }, [shareModal.isOpen])

  const encodedUrl = React.useMemo(() => {
    if (shareModal.isOpen && shareModal.shareUrl) {
      return encodeURIComponent(shareModal.shareUrl)
    }
    return ''
  }, [shareModal.isOpen, shareModal.shareUrl])

  const onOpenChange = () => {
    dispatch(
      updateShareModal({
        isOpen: false,
      }),
    )
  }

  return (
    <Dialog open={shareModal.isOpen} onOpenChange={onOpenChange}>
      <DialogContentOverlayBlur className="max-w-[calc(100vw-32px)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <ShareButton
            icon={<TwitterIcon size={16} />}
            label="Share on X"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
                '_blank',
              )
            }
          />
          <ShareButton
            icon={<CopyIcon size={16} />}
            label="Copy Link"
            onClick={() => {
              navigator.clipboard.writeText(shareModal.shareUrl || '')
              toast.success('Link copied to clipboard', {
                richColors: true,
                dismissible: true,
              })
            }}
          />
          <ShareButton
            icon={<MoreHorizontalIcon size={16} />}
            label="Other"
            onClick={() => {
              navigator.share({
                title: 'Share',
                text: 'Check this on Eden',
                url: shareModal.shareUrl,
              })
            }}
          />
        </div>
      </DialogContentOverlayBlur>
    </Dialog>
  )
}

export default ShareDialog

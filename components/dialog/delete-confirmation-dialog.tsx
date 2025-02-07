'use client'

import { Button } from '@/components/ui/button'
import DialogContentOverlayBlur from '@/components/ui/custom/dialog-content-overlay-blur'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteDialog } from '@/stores/dialogs/dialogs.selector'
import { updateDeleteDialog } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'

const DeleteConfirmationDialog = () => {
  const dispatch = useAppDispatch()
  const {
    isOpen,
    title,
    description,
    onDelete: onDeleteCallback,
  } = useDeleteDialog()

  const onDelete = () => {
    onDeleteCallback()
    dispatch(updateDeleteDialog({ isOpen: false }))
  }

  const onCancel = () => {
    dispatch(updateDeleteDialog({ isOpen: false }))
  }

  const handleOpenChange = (open: boolean) => {
    dispatch(updateDeleteDialog({ isOpen: open }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContentOverlayBlur>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContentOverlayBlur>
    </Dialog>
  )
}

export default DeleteConfirmationDialog

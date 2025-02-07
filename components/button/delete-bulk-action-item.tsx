import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useMultiSelection } from '@/contexts/multi-select-context'
import { useDeleteBulk } from '@/hooks/use-delete-bulk'
import { updateDeleteDialog } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { CreationV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import React from 'react'

type Props = {
  items: CreationV2[]
  type: 'creation'
  queryKey: QueryKey
}

const DeleteBulkActionItem = ({ type, items, queryKey }: Props) => {
  const { clearSelection } = useMultiSelection()
  const dispatch = useAppDispatch()

  const { handleDelete } = useDeleteBulk({
    type,
    items,
    queryKey,
  })

  const onDelete = async () => {
    dispatch(
      updateDeleteDialog({
        isOpen: true,
        title: `Delete ${type}s`,
        description: `Are you sure you want to delete these ${type}s?`,
        onDelete: async () => {
          await handleDelete()
          clearSelection()
        },
      }),
    )
  }

  return (
    <>
      <DropdownMenuItem
        onClick={onDelete}
        className="cursor-pointer text-destructive"
      >
        <Trash2Icon className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </>
  )
}

export default DeleteBulkActionItem

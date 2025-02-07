import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useDelete } from '@/hooks/use-delete'
import { updateDeleteDialog } from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { Agent, CollectionV2, CreationV2, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import React from 'react'

type Props = {
  item: ModelV2 | CreationV2 | CollectionV2 | Agent
  type: 'creation' | 'model' | 'collection' | 'agent'
  queryKey: QueryKey
}

const DeleteActionItem = ({ type, item, queryKey }: Props) => {
  const dispatch = useAppDispatch()
  const { handleDelete } = useDelete({ type, item, queryKey })

  const onDelete = () => {
    dispatch(
      updateDeleteDialog({
        isOpen: true,
        title: `Delete ${type}`,
        description: `Are you sure you want to delete this ${type}?`,
        onDelete: handleDelete,
      }),
    )
  }

  return (
    <DropdownMenuItem
      onClick={onDelete}
      className="cursor-pointer text-destructive"
    >
      <Trash2Icon className="mr-2 h-4 w-4" />
      <span>Delete</span>
    </DropdownMenuItem>
  )
}

export default DeleteActionItem

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import DialogContentOverlayBlur from '@/components/ui/custom/dialog-content-overlay-blur'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCollectionsLight } from '@/hooks/query/use-collections-light'
import {
  useAddToCollectionModal,
  useCreateCollectionModalOpen,
} from '@/stores/dialogs/dialogs.selector'
import {
  toggleCreateCollectionModal,
  updateAddToCollectionModal,
} from '@/stores/dialogs/dialogs.slice'
import { useAppDispatch } from '@/stores/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import axios, { AxiosError } from 'axios'
import { LockIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createCollectionSchema = z.object({
  name: z.string().optional(),
})

type CreateCollectionDto = z.infer<typeof createCollectionSchema>

const CollectionSelectionDialog = () => {
  const dispatch = useAppDispatch()
  const addToCollectionModal = useAddToCollectionModal()
  const isCreateCollectionModalOpen = useCreateCollectionModalOpen()
  const [isAddingToCollection, setIsAddingToCollection] = React.useState(false)

  const { collections, refetch } = useCollectionsLight({
    enabled: isCreateCollectionModalOpen || addToCollectionModal.isOpen,
  })

  const collectionHasAllCreations = React.useMemo(() => {
    if (!collections || !addToCollectionModal.creationIds) return {}

    const mapping: Record<string, boolean> = {}

    for (const collection of collections) {
      mapping[collection._id] = addToCollectionModal.creationIds.every(
        creationId => collection.creations.includes(creationId),
      )
    }

    return mapping
  }, [collections, addToCollectionModal.creationIds])

  const handleAddToCollectionModalOpenChange = React.useCallback(() => {
    dispatch(
      updateAddToCollectionModal({ isOpen: !addToCollectionModal.isOpen }),
    )
  }, [dispatch, addToCollectionModal])

  const handleCreateCollectionModalOpenChange = React.useCallback(() => {
    dispatch(toggleCreateCollectionModal())
  }, [dispatch])

  const createCollectionForm = useForm<CreateCollectionDto>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: '',
    },
  })

  const onCreateCollection = async (data: CreateCollectionDto) => {
    try {
      await axios.post(`/api/collections`, data)
      refetch()
      toast.success('Collection create', {
        description: `Collection: ${data.name} created successfully`,
        dismissible: true,
        richColors: true,
      })
      handleCreateCollectionModalOpenChange()
    } catch (error) {
      toast.error('Collection creation failed', {
        description:
          // @ts-ignore
          (error as AxiosError).response?.data?.message ||
          'Unknown Error has occurred',
        richColors: true,
        dismissible: true,
      })
    }
  }

  const onAddToCollection = async (collectionId: string) => {
    setIsAddingToCollection(true)
    try {
      await axios.patch(`/api/collections/${collectionId}/add-creations`, {
        creationIds: addToCollectionModal.creationIds,
      })
      toast.success('Creations added to collection', {
        description: `Creations added to collection successfully`,
        dismissible: true,
        richColors: true,
      })
    } catch (error) {
      toast.error('Failed to add creations to collection', {
        description: `Failed to add creations to collection`,
        dismissible: true,
        richColors: true,
      })
    }
    setIsAddingToCollection(false)
  }

  const onRemoveFromCollection = async (collectionId: string) => {
    try {
      await axios.patch(`/api/collections/${collectionId}/remove-creations`, {
        creationIds: addToCollectionModal.creationIds,
      })
      toast.success('Creations removed from collection', {
        description: `Creations removed from collection successfully`,
        dismissible: true,
        richColors: true,
      })
    } catch (error) {
      toast.error('Failed to remove creations from collection', {
        description: `Failed to remove creations from collection`,
        dismissible: true,
        richColors: true,
      })
    }
  }

  const onCheckboxChange = async (
    collectionId: string,
    checked: CheckedState,
  ) => {
    setIsAddingToCollection(true)
    if (checked) {
      await onAddToCollection(collectionId)
    } else {
      await onRemoveFromCollection(collectionId)
    }
    await refetch()
    setIsAddingToCollection(false)
  }

  if (!collections) {
    return null
  }

  return (
    <>
      <Dialog
        open={addToCollectionModal.isOpen}
        onOpenChange={handleAddToCollectionModalOpenChange}
      >
        <DialogContentOverlayBlur className="max-w-[calc(100vw-32px)] sm:max-w-lg">
          <DialogTitle>Add to collection</DialogTitle>
          <DialogDescription>
            Select a collection to add the selected items to. Duplicates will be
            skipped.
          </DialogDescription>
          {collections.length > 0 ? (
            <>
              <div className="max-h-72 w-full overflow-x-hidden overflow-y-auto">
                {collections.map(collection => (
                  <div
                    key={collection._id}
                    className="flex items-center justify-between gap-x-2 my-4"
                  >
                    <div className="flex items-center gap-x-2 overflow-hidden">
                      <Checkbox
                        id={collection._id}
                        onCheckedChange={checked => {
                          onCheckboxChange(collection._id, checked)
                        }}
                        checked={collectionHasAllCreations[collection._id]}
                        disabled={isAddingToCollection}
                      />
                      <label
                        htmlFor={collection._id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-x-2 overflow-hidden"
                      >
                        <span className="overflow-hidden text-ellipsis text-nowrap">
                          {collection.name}
                        </span>
                        {!collection.public && (
                          <LockIcon
                            size={16}
                            className="flex-shrink-0 text-muted-foreground"
                          />
                        )}
                        {collection.contributors &&
                        collection.contributors.length > 0 ? (
                          <Badge variant="secondary">Shared</Badge>
                        ) : null}
                      </label>
                    </div>
                    <span className="text-muted-foreground text-xs bg-muted rounded-md px-2 py-1">
                      {collection.creations.length}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-0" />
            </>
          ) : (
            <p>No collections found</p>
          )}
          <Button
            variant="secondary"
            size="lg"
            className="!w-full"
            onClick={handleCreateCollectionModalOpenChange}
          >
            Create new collection
          </Button>
        </DialogContentOverlayBlur>
      </Dialog>
      <Dialog
        open={isCreateCollectionModalOpen}
        onOpenChange={handleCreateCollectionModalOpenChange}
      >
        <DialogContentOverlayBlur>
          <DialogTitle>Create collection</DialogTitle>
          <DialogDescription>
            Create a new collection to add the selected items to.
          </DialogDescription>
          <Form {...createCollectionForm}>
            <form
              onSubmit={createCollectionForm.handleSubmit(onCreateCollection)}
              className="space-y-4"
            >
              <FormField
                control={createCollectionForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Collection Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={createCollectionForm.formState.isSubmitting}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContentOverlayBlur>
      </Dialog>
    </>
  )
}

export default CollectionSelectionDialog

'use client'

import ModelMiniCard from '@/components/card/model-mini-card'
import FileUploader from '@/components/media/file-uploader'
import ModelSelectorModal from '@/components/modal/model-selector-modal'
import { Button } from '@/components/ui/button'
import { AutosizeTextarea } from '@/components/ui/custom/autoresize-textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { slugifyName } from '@/utils/slug.util'
import { Agent } from '@edenlabs/eden-sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Edit2Icon, PlusIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const agentSchema = z.object({
  name: z.string().min(1).max(42),
  key: z
    .string()
    .min(1)
    .max(42)
    .regex(/^[a-z0-9_]+(?:-[a-z0-9_]+)*$/, {
      message:
        'Key must only contain lowercase letters, numbers, underscores and dashes.',
    }),
  image: z.string().optional(),
  description: z.string().min(1).max(10000),
  instructions: z.string().min(1).max(10000),
  discordId: z.string().optional(),
  modelId: z.string().optional(),
})

type AgentFormDto = z.infer<typeof agentSchema>

type AgentSheetProps = {
  mode: 'create' | 'update'
  agent?: Agent
  onAction: () => Promise<void>
}

function CharacterCount({ current, max }: { current: number; max: number }) {
  return (
    <div className="ml-auto text-xs text-muted-foreground flex-shrink-0 text-right">
      {current}/{max} chars
    </div>
  )
}

const AgentFormSheet = ({ mode, agent, onAction }: AgentSheetProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hasEditParam = searchParams.get('edit')
  const [isOpen, setIsOpen] = useState(
    hasEditParam !== null ? hasEditParam === 'true' : false,
  )
  const [isManualKeyEdit, setIsManualKeyEdit] = useState(false)
  const isUpdateMode = hasEditParam || mode === 'update'

  const form = useForm<AgentFormDto>({
    resolver: zodResolver(agentSchema),
    defaultValues: isUpdateMode
      ? {
          name: agent?.name,
          key: agent?.username || '',
          image: agent?.userImage,
          description: agent?.description,
          instructions: agent?.instructions,
          discordId: agent?.discordId ?? '',
          modelId: agent?.model,
        }
      : {
          name: '',
          key: '',
          description: '',
          instructions: '',
          // discordId: '',
          // modelId: '',
        },
  })

  const name = form.watch('name')

  useEffect(() => {
    if (!isManualKeyEdit && name && !isUpdateMode) {
      form.setValue('key', slugifyName(name))
    }
  }, [form, name, isManualKeyEdit, isUpdateMode])

  const handleSubmit = async (data: AgentFormDto) => {
    try {
      if (isUpdateMode) {
        await axios.patch(`/api/agents/${agent?._id}`, data)
        toast.success('Agent updated successfully', {
          description: `"${data.name}" has been updated successfully`,
          richColors: true,
          dismissible: true,
        })
      } else {
        await axios.post('/api/agents', data)
        toast.success('Agent created successfully', {
          description: `"${data.name}" has been created successfully`,
          richColors: true,
          dismissible: true,
        })
      }
      onOpenChange(false)
      await onAction()
    } catch (error) {
      toast.error(
        `${isUpdateMode ? 'Agent update' : 'Agent creation'} failed`,
        {
          description:
            // @ts-expect-error needs proper typings
            (error as AxiosError).response?.data?.message ||
            'Unknown Error has occurred',
          richColors: true,
          dismissible: true,
        },
      )
    }
  }

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (hasEditParam && !open) {
      router.replace(`/agents/${agent?.username}`)
    }
    // form.reset()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size={isUpdateMode ? 'icon' : 'default'}
          className={isUpdateMode ? '' : 'gap-x-2'}
        >
          {isUpdateMode ? (
            <Edit2Icon size={18} />
          ) : (
            <>
              <PlusIcon className="size-4" />
              <div className="text-sm font-semibold">Create Agent</div>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto w-full sm:!max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle>
            {isUpdateMode ? 'Update Agent' : 'Create an Agent'}
          </SheetTitle>
          <SheetDescription>
            {isUpdateMode
              ? 'Update your agent'
              : 'Create an agent to help you with your tasks.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="w-full space-y-4 py-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/** Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Display Name*</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="My helpful Agent"
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value.slice(0, 42))
                      }}
                    />
                  </FormControl>
                  <div className="flex gap-2 flex-wrap">
                    {!isUpdateMode && (
                      <FormDescription>
                        Friendly Name of your agent. This will be displayed to
                        users.
                      </FormDescription>
                    )}
                    <CharacterCount
                      current={field.value?.length || 0}
                      max={42}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Key Field */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between">
                    <FormLabel>Name*</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setIsManualKeyEdit(!isManualKeyEdit)}
                    >
                      {isManualKeyEdit ? 'Auto Generate' : 'Manual Edit'}
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="helpful-agent-1"
                      {...field}
                      onChange={e => {
                        if (isManualKeyEdit) {
                          const value = e.target.value
                            .toLowerCase()
                            .slice(0, 42)
                          field.onChange(value)
                        } else {
                          field.onChange(e.target.value)
                        }
                      }}
                      onBlur={e => {
                        if (isManualKeyEdit) {
                          field.onChange(
                            slugifyName(e.target.value.slice(0, 42)),
                          )
                        }
                        field.onBlur()
                      }}
                      readOnly={!isManualKeyEdit}
                      className={!isManualKeyEdit ? 'bg-accent' : ''}
                      disabled={!isManualKeyEdit}
                    />
                  </FormControl>
                  <div className="flex gap-2 flex-wrap">
                    <FormDescription>
                      {isManualKeyEdit ? (
                        <>
                          Enter a unique name for your agent.
                          <span className="block mt-1 text-xs text-muted-foreground">
                            Lowercase letters, numbers, and dashes only.
                          </span>
                        </>
                      ) : (
                        <>
                          Unique name of your agent. Auto-generated from display
                          name
                        </>
                      )}
                    </FormDescription>
                    <CharacterCount
                      current={field.value?.length || 0}
                      max={42}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      className={'hidden'}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value === null ? '' : field.value || ''}
                    />
                  </FormControl>
                  <FileUploader
                    value={field.value === null ? [] : field.value || []}
                    onChange={field.onChange}
                    allowedFileTypes={['image']}
                    maxFiles={1}
                    allowMultiple={false}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <AutosizeTextarea
                      placeholder="Abraham is a helpful agent"
                      {...field}
                    />
                  </FormControl>
                  <CharacterCount
                    current={field.value?.length || 0}
                    max={10000}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Instructions Field */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Instructions*</FormLabel>
                  <FormControl>
                    <AutosizeTextarea
                      placeholder="Instruct your agent how to act"
                      {...field}
                    />
                  </FormControl>
                  <CharacterCount
                    current={field.value?.length || 0}
                    max={10000}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Model Field */}
            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Flux LoRa (Optional)</FormLabel>
                  <div>
                    {field.value && (
                      <div className="relative mb-2">
                        <ModelMiniCard modelId={field.value}>
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute h-[calc(100%-16px)] top-2 right-2 hover:bg-destructive hover:text-destructive-foreground"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation()
                              field.onChange('')
                            }}
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </ModelMiniCard>
                      </div>
                    )}
                    <ModelSelectorModal
                      className="p-4 md:p-8 w-full"
                      title="Select Flux LoRa"
                      description="Pick a Flux LoRa to use as a default model for this agent"
                      base_model="flux-dev"
                      currentValue={field.value || ''}
                      onChange={field.onChange}
                      trigger={
                        <Button type="button" variant="outline">
                          {field.value
                            ? 'Change Flux LoRa'
                            : 'Select Flux LoRa'}
                        </Button>
                      }
                    />
                  </div>
                </FormItem>
              )}
            />

            {/** Discord ID Field */}
            <FormField
              control={form.control}
              name="discordId"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Discord ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the Discord ID of your agent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isUpdateMode ? 'Update Agent' : 'Create Agent'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default AgentFormSheet

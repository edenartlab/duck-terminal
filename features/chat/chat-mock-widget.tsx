'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AutosizeTextarea } from '@/components/ui/custom/autoresize-textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { AgentLink } from '@/features/chat/chat'
import { useAgentQuery } from '@/hooks/query/use-agent-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'
import {
  Agent,
  ThreadsCreateArguments,
  ThreadsCreateResponse,
} from '@edenlabs/eden-sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError, AxiosInstance } from 'axios'
import {
  CatIcon,
  ImageIcon,
  Keyboard,
  ListIcon,
  Loader2Icon,
  PersonStandingIcon,
  SendIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const chatMockSchema = z.object({
  message: z.string().min(1).max(30000),
  attachments: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof chatMockSchema>
type Props = {
  agentId: string
  agentSSRData?: Agent
}

const FORM_STORAGE_KEY = 'chat-mock-form-state'

interface Suggestion {
  text: string
  prompt: string
  icon: ReactNode
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    text: 'What tools can you use?',
    prompt: 'Can you list all the tools and capabilities you have access to?',
    icon: <ListIcon className="h-4 w-4" />,
  },
  {
    text: 'Animate my logo',
    prompt:
      'I would like to animate my company logo. Can you help me with that?',
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    text: 'Make cute cat images',
    prompt: 'Can you create some cute cat images for me?',
    icon: <CatIcon className="h-4 w-4" />,
  },
  {
    text: 'Help me draft a character',
    prompt: 'I need help creating a character design. Can you assist me?',
    icon: <PersonStandingIcon className="h-4 w-4" />,
  },
]

export const ChatMockWidget: FC<Props> = ({ agentId, agentSSRData }) => {
  const { agent: agentClientData } = useAgentQuery({
    key: agentId,
    initialData: agentSSRData
      ? {
          agent: agentSSRData,
        }
      : undefined,
  })

  const agent = agentClientData || agentSSRData

  const { verifyAuth, isSignedIn } = useAuthState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [shouldShowHint, setShouldShowHint] = useState(false)

  //@todo: use defaults to repopulate on return from auth redirect - if any
  const defaultValues: FormData = {
    message: '',
    attachments: [],
  }

  // Move the stored data check to a separate effect that runs once
  const [initialFormData, setInitialFormData] =
    useState<FormData>(defaultValues)
  const [hasStoredData, setHasStoredData] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(chatMockSchema),
    defaultValues: initialFormData,
  })

  // Load stored data and reset form when found
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setInitialFormData(parsed)
        setHasStoredData(true)
        // Reset form with stored data
        form.reset(parsed)
      }
    } catch (e) {
      console.error('Error reading stored form state:', e)
    }
  }, []) // Empty dependency array - runs once on mount

  const message = form.watch('message')

  // Add this effect to handle hint visibility
  useEffect(() => {
    const messageLength = message?.length || 0
    setShouldShowHint(messageLength > 3)
  }, [message])

  // Store form state before auth redirect
  const handleSubmit = async (formData: FormData) => {
    console.log('handleSubmit', formData)
    if (!(await verifyAuth())) {
      // Save form state before redirect
      const currentFormData = form.getValues()
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(currentFormData))
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post<
        AxiosInstance,
        { data: ThreadsCreateResponse },
        ThreadsCreateArguments
      >('/api/threads', {
        agent_id: siteConfig.featured.agents[0],
        content: formData.message,
        attachments: formData.attachments,
      })

      if (!response || !response.data || !response.data?.thread_id) {
        toast.error(`Failed to create thread!`, {
          description: JSON.stringify(response),
          dismissible: true,
          richColors: true,
        })
        return
      }

      router.push(`/chat/${agent?.username}/${response.data.thread_id}`)
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? JSON.parse((err as AxiosError).request.responseText)?.message
        : 'Unknown Error'

      toast.error(`Failed to create thread!`, {
        description: JSON.stringify(errorMessage),
        dismissible: true,
        richColors: true,
      })
    } finally {
      setIsSubmitting(false)
      // Clean up storage after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY)
      setHasStoredData(false)
    }
  }

  // Auto-submit effect
  useEffect(() => {
    const shouldAutoSubmit = isSignedIn && hasStoredData && !isSubmitting

    if (shouldAutoSubmit) {
      const formData = form.getValues()
      if (formData.message) {
        handleSubmit(formData)
      }
    }
  }, [isSignedIn, hasStoredData, isSubmitting])

  // Separate cleanup effect
  useEffect(() => {
    return () => {
      localStorage.removeItem(FORM_STORAGE_KEY)
    }
  }, []) // Empty dependency array for cleanup on unmount

  const handleSuggestionClick = (prompt: string) => {
    form.setValue('message', prompt)
    form.handleSubmit(handleSubmit)()
  }

  return (
    <div data-testid="chat-mock-widget">
      <div className="mb-6 flex justify-around">
        <div className="flex flex-col items-center w-fit">
          <AgentLink agent={agent} className="h-12 w-12 md:h-16 md:w-16" />
          <div className="inline-flex ml-16 p-2 mt-2 bg-purple-600/40 rounded-lg rounded-tl-none">
            How can I help you today?
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          className="flex gap-2 w-full bg-popover border border-secondary rounded-lg p-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            name="message"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormControl id={'message'}>
                  <AutosizeTextarea
                    className="w-full mb-2 !border-none !ring-0 !outline-none !ring-offset-0"
                    placeholder="Type your message here..."
                    rows={4}
                    minHeight={96}
                    autoFocus={true}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value || ''}
                    disabled={isSubmitting}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (form.formState.isValid && !isSubmitting) {
                          form.handleSubmit(handleSubmit)()
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div
                  className={cn(
                    'absolute bottom-4 right-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-all duration-200',
                    shouldShowHint
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none',
                  )}
                >
                  <Keyboard className="h-3 w-3" />
                  <span className="opacity-70">
                    <Badge variant="outline" className="rounded-sm px-1.5">
                      Enter
                    </Badge>{' '}
                    to send,{' '}
                    <Badge variant="outline" className="px-1.5 rounded-sm">
                      Shift+Enter
                    </Badge>{' '}
                    for new line
                  </span>
                </div>
              </FormItem>
            )}
          />
          <div
            className={cn(
              'flex justify-end transition-all origin-center opacity-0 translate-y-4',
              isSubmitting && 'opacity-50 translate-y-0',
              form.formState.isValid && 'opacity-100 translate-y-0 ',
            )}
          >
            <Button
              variant="secondary"
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
        <div className="mt-6 mb-2 flex gap-2 flex-wrap justify-center">
          {DEFAULT_SUGGESTIONS.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              type="button"
              className="flex gap-2 rounded-full"
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              disabled={isSubmitting}
            >
              {suggestion.icon}
              {suggestion.text}
            </Button>
          ))}
        </div>
      </Form>
    </div>
  )
}

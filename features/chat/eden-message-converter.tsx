'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import {
  CompleteAttachment,
  MessageStatus,
  useExternalMessageConverter,
} from '@assistant-ui/react'
import { ToolCallContentPart } from '@assistant-ui/react'
import {
  AssistantMessage,
  SystemMessage,
  UserMessage,
} from '@edenlabs/eden-sdk'

export type EdenMessage = { status?: MessageStatus } & (
  | UserMessage
  | SystemMessage
  | AssistantMessage
)
// | ToolMessage

const contentToParts = (
  message: EdenMessage,
  content:
    | UserMessage['content']
    | AssistantMessage['content']
    | SystemMessage['content'],
) => {
  if (message.role === 'assistant') {
    if (
      //@ts-expect-error message type is not correct
      message.status?.type === 'incomplete' &&
      //@ts-expect-error message type is not correct
      message.status?.reason === 'error'
    ) {
      return [
        {
          type: 'ui' as const,
          display: (
            <Alert variant="destructive">
              <AlertTitle>Failed response!</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <Separator />
                <div>{content}</div>
              </AlertDescription>
            </Alert>
          ),
        },
      ]
    }
  }

  return [{ type: 'text' as const, text: content }]
}

export const edenMessageConverter: useExternalMessageConverter.Callback<
  EdenMessage
> = message => {
  switch (message.role) {
    case 'system':
      return {
        id: message.id,
        role: 'system',
        metadata: message.metadata,
        content: [{ type: 'text', text: message.content }],
        status: message.status,
        createdAt: message.createdAt,
      }
    case 'user':
      return {
        id: message.id,
        role: 'user',
        metadata: message.metadata,
        content: contentToParts(message, message.content),
        attachments: message.attachments?.map(
          (attachment, idx) =>
            ({
              id: idx.toString(),
              type: 'image',
              name: attachment,
              content: [
                {
                  type: 'image',
                  image: getCloudfrontOriginalUrl(attachment),
                },
              ],
              // contentType: attachment.contentType ?? "unknown/unknown",
              contentType: 'image/png',
              status: { type: 'complete' },
            } satisfies CompleteAttachment),
        ),
        status: message.status,
        createdAt: message.createdAt,
      }
    case 'assistant':
      // console.log('convertEdenMessage', 'assistant', message)
      return {
        id: message.id,
        role: 'assistant',
        metadata: message.metadata,
        content: [
          ...contentToParts(message, message.content),
          ...(message.tool_calls?.map(
            (chunk): ToolCallContentPart => ({
              type: 'tool-call',
              toolCallId: chunk.id,
              toolName: 'task_result',
              args: chunk.args,
              argsText: JSON.stringify(chunk.args, null, 2),
              result: {
                tool: chunk.tool,
                status: chunk.status,
                result: chunk.result,
                error: chunk.error,
              },
            }),
          ) ?? []),
        ],
        // status: getToolCallStatus(message),
        status: message.status,
        createdAt: message.createdAt,
      }
  }
}

'use client'

import ErrorBoundary from '@/components/error-boundary'
import { LightboxGallery, LightboxTrigger } from '@/components/media/lightbox'
import TextClampMore from '@/components/text/text-clamp-more'
import { ToolFallback } from '@/features/chat/components/tools/tool-fallback'
import { getFileTypeByMimeType } from '@/lib/files'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import { makeAssistantToolUI } from '@assistant-ui/react'
import { TaskV2Result, TaskV2Status, ToolV2 } from '@edenlabs/eden-sdk'
import React from 'react'
import ReactMarkdown from 'react-markdown'

// Define ReadonlyJSONValue if not found in any library
type ReadonlyJSONValue = string | number | boolean | null | { readonly [key: string]: ReadonlyJSONValue } | ReadonlyJSONValue[];

export type TaskResultToolArgs = {
  // result: {
  tool: ToolV2['key']
  result: TaskV2Result[]
  status: TaskV2Status
  error?: string
  // }
}

export const TaskResultTool = makeAssistantToolUI<
  TaskResultToolArgs & { result: ReadonlyJSONValue }, // Updated type constraint
  TaskResultToolArgs
>({
  toolName: 'task_result',
  render: ({ args, argsText, status, result }) => {
    const { tool, result: toolResults } = result as TaskResultToolArgs
    // console.log('args', args)

    return (
      <div className="mb-2">
        <ToolFallback
          type="tool-call"
          result={result}
          toolCallId={tool}
          toolName={tool}
          args={args}
          argsText={argsText}
          status={status}
          addResult={() => console.log('adding result', result)}
        />
        <ErrorBoundary>
          <LightboxGallery>
            <div
              className={cn([
                toolResults && toolResults.length > 1 && 'grid',
                'grid-cols-2 gap-4',
              ])}
            >
              {toolResults
                ? toolResults.map((result, index) => (
                    <div className="relative" key={`${index}-${tool}`}>
                      {result && Array.isArray(result?.output) ? (
                        result.output.map((output, outputIndex) => (
                          <div
                            key={`${index}-${outputIndex}-${output.filename}`}
                          >
                            {getFileTypeByMimeType(
                              output.mediaAttributes?.mimeType,
                            ) === 'audio' ? (
                              <audio controls className="w-full max-w-2xl">
                                <source
                                  src={getCloudfrontOriginalUrl(
                                    output.filename,
                                  )}
                                  type={output.mediaAttributes?.mimeType}
                                />
                              </audio>
                            ) : (
                              <LightboxTrigger
                                // className="w-full h-full"
                                slide={{
                                  url: getCloudfrontOriginalUrl(
                                    output.filename,
                                  ),
                                  thumbnail: getCloudfrontOriginalUrl(
                                    output.filename,
                                  ),
                                  width: output.mediaAttributes?.width,
                                  height: output.mediaAttributes?.height,
                                  duration:
                                    output.mediaAttributes?.duration ||
                                    undefined,
                                  description:
                                    args && args.prompt
                                      ? String(args.prompt)
                                      : undefined,
                                  title:
                                    args && args.prompt
                                      ? String(tool)
                                      : undefined,
                                }}
                                startIndex={index}
                                imageProps={{
                                  // loading: 'lazy',
                                  blurhash: output.mediaAttributes?.blurhash,
                                  className: 'max-h-[420px]',
                                }}
                                videoProps={{
                                  className: 'max-h-[420px]',
                                }}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className=" px-4 p-2 bg-accent rounded-md border border-secondary">
                          <TextClampMore
                            text={
                              <ReactMarkdown>
                                {(result?.output as unknown as string) || ''}
                              </ReactMarkdown>
                            }
                            lines={3}
                          />
                        </div>
                      )}
                    </div>
                  ))
                : null}
            </div>
          </LightboxGallery>
        </ErrorBoundary>
      </div>
    )
  },
})

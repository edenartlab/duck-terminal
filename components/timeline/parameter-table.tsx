import TextClampMore from '../text/text-clamp-more'
import { LightboxGallery, LightboxTrigger } from '@/components/media/lightbox'
import PreviewVideoPlayer from '@/components/timeline/preview-video-player'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { Long, cn, toBigInt } from '@/lib/utils'
import { TaskV2, TaskV2Args } from '@edenlabs/eden-sdk'
import { LockKeyholeIcon, SquareCheckBigIcon, SquareIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const imageInputParameterNames = [
  'image',
  'init_image',
  'mask_image',
  'prompt_image',
  'control_image',
  'control_input',
  'subject_image',
  'dummy_image',
  'person_image',
  'style_image',
  'images',
  'preference_anchor',
  'lora_training_urls',
]

const videoInputParameterNames = ['video', 'input_video']

type Props = {
  taskId?: TaskV2['_id']
  args: TaskV2Args
  className?: string
  hideHeader?: boolean
}

const ParameterTable = ({ taskId, args, hideHeader, className }: Props) => {
  const [copiedText, copy] = useCopyToClipboard()
  const handleCopyString = (parameterName: string, text: string) => () => {
    copy(text)
      .then(() => {
        toast.success(`Copied "${parameterName}"`, {
          description:
            text && text.length > 100 ? text.slice(0, 100) + '...' : text,
          dismissible: true,
          richColors: true,
        })
        console.log('Copied!', { copiedText })
      })
      .catch(error => {
        toast.error(`Failed to copy!`, {
          description: error,
          dismissible: true,
          richColors: true,
        })
      })
  }

  const allArgs = taskId
    ? Object.entries({ taskId, ...args })
    : Object.entries({ ...args })

  return (
    <Table className={cn([`text-xs table-fixed w-full h-full`, className])}>
      {!hideHeader ? (
        <TableHeader className="rounded-t-lg overflow-hidden md:rounded-none md:overflow-auto">
          <TableRow className="bg-popover/50">
            <TableHead className="h-10 py-2 w-1/3 md:w-[150px]">
              Parameter
            </TableHead>
            <TableHead className="h-10 py-2 w-2/3 md:w-auto">Value</TableHead>
          </TableRow>
        </TableHeader>
      ) : null}
      <TableBody className="bg-popover/20">
        {allArgs.map(taskArg => (
          <TableRow key={taskArg[0]} className="cursor-pointer text-xs">
            <TableCell className="flex items-center gap-1 px-2 py-2 text-muted-foreground w-1/3 md:w-[125px] truncate align-top">
              {taskArg[0]}
              {taskArg[0] === 'lora_training_urls' ? (
                <LockKeyholeIcon className="relative h-3.5 w-3.5 flex-shrink-0" />
              ) : null}
            </TableCell>
            <TableCell className="pl-0 pr-2 py-2 w-2/3 md:w-auto">
              {imageInputParameterNames.includes(taskArg[0]) ? (
                <div className="flex gap-2">
                  <LightboxGallery>
                    {[taskArg[1] as string]
                      .flat()
                      .filter(Boolean)
                      .map((inputImageUrl, index) => (
                        <LightboxTrigger
                          className="!relative rounded-lg cursor-zoom-in hover:brightness-105 !h-20 w-auto"
                          key={`${inputImageUrl}_${index}`}
                          slide={{
                            url: getCloudfrontOriginalUrl(inputImageUrl),
                            thumbnail: getCloudfrontOriginalUrl(inputImageUrl),
                          }}
                          startIndex={index}
                          imageProps={{
                            unoptimized: true,
                          }}
                        />
                      ))}
                  </LightboxGallery>
                </div>
              ) : videoInputParameterNames.includes(taskArg[0]) ? (
                <div className="flex flex-wrap gap-2">
                  {(
                    (Array.isArray(taskArg[1])
                      ? taskArg[1]
                      : [taskArg[1]]) as string[]
                  )
                    .filter(Boolean)
                    .map(inputVideoUrl => (
                      <PreviewVideoPlayer
                        key={inputVideoUrl}
                        src={inputVideoUrl}
                        width={72}
                        height={72}
                        className="hover:brightness-105"
                      />
                    ))}
                </div>
              ) : typeof taskArg[1] === 'boolean' ? (
                taskArg[1] ? (
                  <SquareCheckBigIcon size={16} />
                ) : (
                  <SquareIcon size={16} />
                )
              ) : typeof taskArg[1] === 'object' &&
                !Array.isArray(taskArg[1]) ? (
                taskArg[1] !== null ? (
                  toBigInt(taskArg[1] as unknown as Long).toString()
                ) : (
                  '-'
                )
              ) : (
                <div
                  onClick={handleCopyString(
                    taskArg[0],
                    String(taskArg[1] !== null ? taskArg[1] : ''),
                  )}
                >
                  <TextClampMore
                    text={taskArg[1] as string}
                    lines={2}
                    className="text-xs"
                  />
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ParameterTable

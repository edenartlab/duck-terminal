import { LightboxGallery, LightboxTrigger } from '@/components/media/lightbox'
import { Button } from '@/components/ui/button'
import { DialogContentScrollable } from '@/components/ui/custom/dialog-content-scrollable'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getFileTypeByMimeType } from '@/lib/files'
import { TaskV2Result } from '@edenlabs/eden-sdk'
import { ImageIcon, XIcon } from 'lucide-react'
import React from 'react'

type Props = {
  intermediateOutputs: TaskV2Result['intermediate_outputs']
}

export const IntermediateOutputsDialog = ({ intermediateOutputs }: Props) => {
  const [open, setOpen] = React.useState(false)
  const [disableEsc, setDisableEsc] = React.useState(false)

  const totalArrayElements = intermediateOutputs
    ? Object.values(intermediateOutputs).reduce(
        (acc, arr) => acc + arr.length,
        0,
      )
    : 0

  const slides = intermediateOutputs
    ? Object.entries(intermediateOutputs).flatMap(output =>
        output[1].map(mediaResult => ({
          url: mediaResult.url || '',
          thumbnail: mediaResult.url || '',
          width: mediaResult.mediaAttributes?.width,
          height: mediaResult.mediaAttributes?.height,
          title: output[0],
          fileType: getFileTypeByMimeType(
            mediaResult.mediaAttributes?.mimeType,
          ),
        })),
      )
    : []

  React.useEffect(() => {
    window.addEventListener('lightbox-open', () => {
      setDisableEsc(true)
    })

    window.addEventListener('lightbox-close', () => {
      setDisableEsc(false)
    })

    return () => {
      window.removeEventListener('lightbox-open', () => {})
      window.removeEventListener('lightbox-close', () => {})
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = ''
      }, 0)

      return () => clearTimeout(timer)
    } else {
      document.body.style.pointerEvents = 'auto'
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (disableEsc) return
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <div
          title="View Intermediate Outputs"
          className="absolute z-10 right-2 bottom-2 bg-purple-600/60 hover:bg-purple-600 border border-purple-600 cursor-pointer text-shadow-sm shadow-popover rounded-md p-1 text-xs flex items-center"
        >
          <ImageIcon className="h-3 w-3 mr-1 drop-shadow-sm shadow-popover" />
          <div className="font-mono">+{totalArrayElements}</div>
        </div>
      </DialogTrigger>
      <DialogContentScrollable className="!max-h-fit p-4 md:p-8 my-4 mx-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Intermediate Outputs</DialogTitle>
          <DialogDescription>
            Controlnet preprocessor, masks, etc
          </DialogDescription>
        </DialogHeader>
        <LightboxGallery>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {slides.map((slide, index) => (
              <div key={`${slide.url}_${index}`}>
                <div className="text-sm bg-secondary p-2 rounded-t-md">
                  {slide.title}
                </div>
                <div className="relative flex justify-center bg-muted-darker p-2 rounded-b-md">
                  {slide.fileType === 'audio' ? (
                    <div className="flex w-full h-full items-center justify-center min-h-64">
                      <audio src={slide.url} controls={true} />
                    </div>
                  ) : (
                    <LightboxTrigger slide={slide} startIndex={index} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </LightboxGallery>
        <DialogClose asChild>
          <Button
            className="absolute top-2 right-2"
            type="button"
            variant="ghost"
            size="icon"
          >
            <XIcon />
          </Button>
        </DialogClose>
      </DialogContentScrollable>
    </Dialog>
  )
}

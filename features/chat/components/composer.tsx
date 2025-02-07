'use client'

import { Button } from '@/components/ui/button'
import { LightboxGallery } from '@/components/media/lightbox'
import MyAttachment from '@/features/chat/components/attachment'
import { AuthClickGuard } from '@/features/chat/components/auth-click-guard'
import { fileMatchesAccept } from '@/features/chat/utils/files'
import { cn } from '@/lib/utils'
import {
  Composer,
  ThreadPrimitive,
  useComposerRuntime,
  ComposerPrimitive,
  useThread,
  useThreadConfig,
  SuggestionConfig,
} from '@assistant-ui/react'
import { BotIcon } from 'lucide-react'
import React, { FC, useState } from 'react'
import { toast } from 'sonner'

type ComposerAttachmentDropzoneProps = {
  isDragging: boolean
  accept: string
}

export const ComposerAttachmentDropzone: FC<
  ComposerAttachmentDropzoneProps
> = ({ isDragging, accept }) => {
  return (
    <div
      className={cn([
        'absolute w-full opacity-0 h-full z-10 left-0 pointer-events-none bg-muted/50 border border-muted-foreground border-dotted rounded-md overflow-hidden',
        isDragging ?? 'opacity-100',
      ])}
    >
      {isDragging && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-purple-400">Drop attachments here</p>
          <div className="text-xs text-muted-foreground">
            Accepted: <span className="font-semibold">{accept}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const ThreadWelcomeSuggestion: FC<{suggestion: SuggestionConfig}> = ({
  suggestion: { text, prompt },
}) => {
  return (
    <ThreadPrimitive.Suggestion className="text-sm px-3 py-1 rounded-full border border-green-400/50 hover:border-green-400 transition-colors" prompt={prompt} method="replace" autoSend>
      <span className="aui-thread-welcome-suggestion-text">
        {text ?? prompt}
      </span>
    </ThreadPrimitive.Suggestion>
  );
};

const MyThreadWelcomeSuggestions: FC = () => {
  const suggestions2 = useThread((t) => t.suggestions);
  const { welcome: { suggestions } = {} } = useThreadConfig();

  const finalSuggestions = suggestions2.length ? suggestions2 : suggestions;

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {finalSuggestions?.map((suggestion, idx) => {
        const key = `${suggestion.prompt}-${idx}`;
        return <ThreadWelcomeSuggestion key={key} suggestion={suggestion} />;
      })}
    </div>
  );
};

export const MyComposer: FC = () => {
  const [isDragging, setIsDragging] = useState(false)
  const composerRuntime = useComposerRuntime()
  const accept = composerRuntime.getAttachmentAccept()

  const handleFilesDropped = async (files: File[]) => {
    // accept contains mimetypes with wildcards like image/*, allow only these
    const acceptedFiles = files.filter(file => fileMatchesAccept(file, accept))

    if (!acceptedFiles.length) {
      console.log('No accepted files in drop')
      toast.error(`Failed to upload!`, {
        description: `No accepted files in drop. Only type/s '${accept}' allowed here`,
        dismissible: true,
        richColors: true,
      })
      return
    }

    await Promise.all(files.map(file => composerRuntime.addAttachment(file)))
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Convert dropped files into an array and pass to the handler
    const files = Array.from(e.dataTransfer.files)
    await handleFilesDropped(files)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  return (
    <div className="w-full">
      <Composer.Root
      className="flex items-center relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      >
        <ComposerAttachmentDropzone isDragging={isDragging} accept={accept} />
        <LightboxGallery>
          <Composer.Attachments components={{ Attachment: MyAttachment }} />
        </LightboxGallery>

        <AuthClickGuard>
          {/* <Composer.AddAttachment /> */}
        </AuthClickGuard>

        <Composer.Input 
          autoFocus 
          placeholder="quack quack"

        />

        <ThreadPrimitive.If running={true}>
          <div className="flex items-center gap-3">
            <BotIcon className="animate-pulse duration-1000 text-purple-600" />
            <ComposerPrimitive.Cancel asChild>
              <Button>Cancel</Button>
            </ComposerPrimitive.Cancel>
          </div>
        </ThreadPrimitive.If>

        <ThreadPrimitive.If running={false}>
          <AuthClickGuard>
            <ComposerPrimitive.Send asChild>
              <Button className="bg-green-400 text-gray-900">Generate</Button>
            </ComposerPrimitive.Send>
          </AuthClickGuard>
        </ThreadPrimitive.If>
      </Composer.Root>
      <AuthClickGuard>
        <MyThreadWelcomeSuggestions />
      </AuthClickGuard>
    </div>
  )
}

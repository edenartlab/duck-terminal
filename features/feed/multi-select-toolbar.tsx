'use client'

import CreationsBulkActionsMenu from '@/components/button/creations-bulk-actions-menu'
import LoadingIndicator from '@/components/loading-indicator'
import { Button } from '@/components/ui/button'
import { useMultiSelection } from '@/contexts/multi-select-context'
import { DownloadFile, downloadFiles } from '@/lib/files'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { generateFilename } from '@/utils/slug.util'
import { QueryKey } from '@tanstack/react-query'
import { DownloadIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  queryKey: QueryKey
}

const MultiSelectToolbar = ({ queryKey }: Props) => {
  const [isPreparingDownload, setIsPreparingDownload] = useState(false)
  const { selectedItems, clearSelection } = useMultiSelection()

  if (selectedItems.length === 0) {
    return null
  }

  const handleDownload = async () => {
    // Implement download functionality
    console.log('Download items:', selectedItems)

    setIsPreparingDownload(true)

    const files: DownloadFile[] = selectedItems.map(item => {
      return {
        url: getCloudfrontOriginalUrl(item.url),
        fileName: generateFilename(
          item._id,
          item.tool,
          item.user.username,
          item.task.args?.prompt?.substring(0, 64).trim(),
        ),
      }
    })

    toast.info(`Downloading...`, {
      description: `${files.length} files`,
      dismissible: true,
      richColors: true,
    })
    await downloadFiles(files)

    setIsPreparingDownload(false)
  }

  return (
    <div className="flex justify-center">
      <div className="fixed rounded-lg bottom-4 md:w-full max-w-md bg-muted bg-opacity-85 backdrop-blur-[2px] flex items-center px-3 py-3 drop-shadow-lg gap-4">
        <span className="text-accent-foreground">
          Selected:{' '}
          <span className="font-mono font-bold">{selectedItems.length}</span>
        </span>
        <div className="flex space-x-2 ml-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={!isPreparingDownload ? handleDownload : undefined}
            className="flex items-center"
            title="Download items"
            disabled={isPreparingDownload}
          >
            {isPreparingDownload ? (
              <LoadingIndicator className="h-5 w-5" />
            ) : (
              <DownloadIcon className="h-5 w-5" />
            )}
            <span className="ml-2 hidden md:block">Download</span>
          </Button>

          <CreationsBulkActionsMenu
            queryKey={queryKey}
            creations={selectedItems}
          />

          <Button
            size="sm"
            variant="ghost"
            onClick={clearSelection}
            className="flex items-center"
            title="Clear selection"
          >
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Clear Selection</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MultiSelectToolbar

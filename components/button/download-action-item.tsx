import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { downloadFile } from '@/lib/files'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { DownloadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  originalFileUrl: string
  saveAsFileName: string
  type: 'creation' | 'model'
}

const DownloadActionItem = ({
  type,
  originalFileUrl,
  saveAsFileName,
}: Props) => {
  const handleFileDownload = async () => {
    await downloadFile(
      getCloudfrontOriginalUrl(originalFileUrl),
      `Eden_${type}_${saveAsFileName}`,
    )
    toast.info(`Downloading...`, {
      description: `${type}: ${saveAsFileName}`,
      dismissible: true,
      richColors: true,
      duration: 500,
    })
  }

  return (
    <DropdownMenuItem onClick={handleFileDownload} className="cursor-pointer">
      <DownloadIcon className="mr-2 h-4 w-4" />
      <span>Download</span>
      {/*<DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>*/}
    </DropdownMenuItem>
  )
}

export default DownloadActionItem

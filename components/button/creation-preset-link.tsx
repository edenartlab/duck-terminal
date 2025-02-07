import { getFileTypeByMimeType } from '@/lib/files'
import { CreationV2 } from '@edenlabs/eden-sdk'
import { FileSlidersIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  creation: CreationV2
  hideLabel?: boolean
}

// Use React.forwardRef to allow refs to be passed to this component
const CreationPresetLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ creation, hideLabel }, ref) => {
    const fileType =
      getFileTypeByMimeType(creation.mediaAttributes?.mimeType) || 'image'

    return (
      <Link
        ref={ref} // pass the ref here
        className="cursor-pointer flex items-center"
        href={`/create/${fileType}/${creation.tool}?creation=${creation._id}`}
        scroll={false}
        shallow={true}
      >
        <FileSlidersIcon className="mr-2 h-4 w-4" />
        {hideLabel ? null : 'Use as Preset'}
        {/*<DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>*/}
      </Link>
    )
  },
)

// Add a display name for easier debugging
CreationPresetLink.displayName = 'CreationPresetLink'

export { CreationPresetLink }

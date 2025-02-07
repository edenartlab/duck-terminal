import { Resolution } from '@/components/form/input/aspect-ratio-selector'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ChevronDownIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

type Props = {
  resolutions: Resolution[]
  activeResolution?: Resolution
  onClick: (resolution: Resolution) => void
} & PropsWithChildren

const AspectRatioDropdown = ({
  resolutions,
  activeResolution,
  onClick,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="h-9 w-8 px-1"
        >
          <ChevronDownIcon size="16px" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 overflow-y-auto max-h-[50dvh]">
        <VisuallyHidden>
          <DropdownMenuLabel>Aspect Ratios / Resolutions</DropdownMenuLabel>
        </VisuallyHidden>
        <DropdownMenuGroup>
          {resolutions.map(resolution => (
            <DropdownMenuItem
              key={resolution.label}
              className={`flex items-center py-1 cursor-pointer ${
                activeResolution && resolution.label === activeResolution.label
                  ? 'bg-muted'
                  : ''
              }`}
              onClick={() => onClick(resolution)}
            >
              <div
                className={`flex items-center justify-center rounded-md h-8 w-12 ${
                  activeResolution &&
                  resolution.label === activeResolution.label
                    ? 'bg-muted-foreground/10'
                    : 'bg-accent-foreground/10'
                }`}
              >
                {resolution.label}
              </div>
              <DropdownMenuShortcut>
                {resolution.width}x{resolution.height}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AspectRatioDropdown

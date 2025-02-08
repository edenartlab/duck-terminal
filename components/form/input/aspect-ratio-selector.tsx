import AspectRatioDropdown from '@/components/form/input/aspect-ratio-dropdown'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { UseFormReturn } from 'react-hook-form'

export type Resolution = {
  label: string
  width: number
  height: number
}

type Props = {
  presetResolutions: string[]
  form: UseFormReturn
}

const AspectRatioSelector = ({ presetResolutions, form }: Props) => {
  const resolutions = presetResolutions
    .map(presetResolution => {
      const splitPreset = presetResolution.split('_')
      const label = splitPreset[0].replace('-', ':')
      const resolution = splitPreset[1].split('x')

      return {
        label,
        width: Number(resolution[0]),
        height: Number(resolution[1]),
      }
    })
    .reverse()

  const widthWatch = form.watch('width')
  const heightWatch = form.watch('height')
  // console.log({ widthWatch, heightWatch })

  const activeIndex = resolutions.findIndex(
    res => res.width === widthWatch && res.height === heightWatch,
  )
  const activeResolution = resolutions[activeIndex]

  const squareAspectIndex = resolutions.findIndex(res => res.label === '1:1')
  const squareResolution = resolutions[squareAspectIndex]

  const landscapeIndex = activeResolution
    ? resolutions.findIndex(
        res =>
          (res.width === activeResolution.width &&
            res.height === activeResolution.height &&
            res.width > res.height) ||
          (res.width === activeResolution.height &&
            res.height === activeResolution.width &&
            res.width > res.height),
      )
    : resolutions.length - 1
  const landscapeResolution =
    resolutions[landscapeIndex !== -1 ? landscapeIndex : resolutions.length - 2]

  const portraitIndex = activeResolution
    ? resolutions.findIndex(
        res =>
          (res.width === activeResolution.width &&
            res.height === activeResolution.height &&
            res.width < res.height) ||
          (res.width === activeResolution.height &&
            res.height === activeResolution.width &&
            res.width < res.height),
      )
    : 0
  const portraitResolution =
    resolutions[portraitIndex !== -1 ? portraitIndex : 1]

  // console.log({
  //   activeIndex,
  //   activeResolution,
  //   landscapeResolution,
  //   squareResolution,
  //   portraitResolution,
  // })

  const visibleResolutions = [
    portraitResolution,
    squareResolution,
    landscapeResolution,
  ]

  // console.log(visibleResolutions)

  const updateFormValues = (resolution: Resolution) => {
    form.setValue('width', resolution.width)
    form.setValue('height', resolution.height)
  }

  return (
    <ToggleGroup
      type="single"
      value={activeResolution ? activeResolution.label : undefined}
      className="border border-muted rounded-md p-1 flex items-center bg-popover"
    >
      {visibleResolutions.map(resolution => (
        <ToggleGroupItem
          key={`${resolution.label}`}
          value={resolution.label}
          aria-label={`Select aspect ratio: ${resolution.label}`}
          asChild
          className="px-1 data-[state=on]:bg-muted data-[state=on]:text-muted-foreground"
        >
          <div
            className={
              'flex items-center gap-1 h-9 w-16 cursor-pointer text-xs rounded-sm justify-center'
            }
            onClick={() => updateFormValues(resolution)}
          >
            <div
              className="border border-primary h-full w-full"
              style={{
                aspectRatio: resolution.width / resolution.height,
                maxHeight:
                  resolution.width / resolution.height > 1 ? '12px' : '20px',
                maxWidth:
                  resolution.width / resolution.height < 1 ? '12px' : '20px',
              }}
            />
            {resolution.label}
          </div>
        </ToggleGroupItem>
      ))}
      <AspectRatioDropdown
        resolutions={resolutions}
        activeResolution={activeResolution || undefined}
        onClick={(resolution: Resolution) => updateFormValues(resolution)}
      />
    </ToggleGroup>
  )
}

export default AspectRatioSelector

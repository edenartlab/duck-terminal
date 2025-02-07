import { SliderWithTooltip } from '@/components/ui/custom/slider-with-tooltip'
import { useFormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = {
  type: 'float' | 'integer'
  min: number
  max: number
  step: number
  onChange: (newVal: number | undefined) => void
  value: number
  unit?: string
  hideNumberInput?: boolean
}

const SliderInputRangeLabel = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => {
  return (
    <span
      className={cn([
        'absolute text-xs font-mono pointer-events-none text-white z-10 mix-blend-difference dark:mix-blend-soft-light',
        className,
      ])}
    >
      {text}
    </span>
  )
}

const SliderInput = ({
  type,
  min,
  max,
  step,
  onChange,
  value,
  unit,
  hideNumberInput = false,
}: Props) => {
  const { formItemId } = useFormField()

  return (
    <div className="flex items-center">
      <div className="relative flex items-center w-full">
        <SliderInputRangeLabel
          text={`${min.toLocaleString()}${unit || ''}`}
          className="left-4"
        />
        <div className="flex-1 relative">
          <SliderWithTooltip
            aria-labelledby={`${formItemId}-label`} // Associate label using ARIA
            className="flex-1"
            defaultValue={[value]}
            value={[value]}
            min={min}
            max={max}
            step={step}
            showTooltip={false}
            onValueChange={val => {
              onChange(val[0])
            }}
          />
        </div>
        <SliderInputRangeLabel
          text={`${max.toLocaleString()}${unit || ''}`}
          className="right-4"
        />
      </div>
      <Input
        className={cn([
          'ml-2 w-28 h-8 rounded-md relative font-mono',
          hideNumberInput ? 'hidden' : '',
        ])}
        type="number"
        min={min || 0}
        max={max || 1}
        step={step ? step : 1}
        value={value}
        onChange={e =>
          onChange(
            e.target.value
              ? type === 'integer'
                ? parseInt(e.target.value)
                : parseFloat(e.target.value)
              : undefined,
          )
        }
      />
    </div>
  )
}

export default SliderInput

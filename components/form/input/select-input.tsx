import {
  DelayedSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = {
  placeholder: string
  label?: string
  icon?: ReactNode
  onChange: (newVal: string | number) => void
  value: string | number
  options: (string | number)[]
  optionLabels?: string[]
  type: 'integer' | 'string'
  suffix?: string
  className?: string
  optionClassName?: string
}

const SelectInput = ({
  placeholder,
  label,
  icon,
  onChange,
  value,
  options,
  optionLabels,
  type,
  suffix,
  className,
  optionClassName,
}: Props) => {
  const optionsFormatted = options.map((option, index) => {
    return {
      value: option,
      label: optionLabels && optionLabels[index] ? optionLabels[index] : option,
    }
  })

  return (
    <DelayedSelect
      onValueChange={newVal =>
        onChange(type === 'integer' ? parseInt(newVal) : newVal)
      }
      value={String(value || '')}
    >
      <SelectTrigger className={cn(['w-full', className])} title={placeholder}>
        {icon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label ? (
            <SelectLabel className="border border-t-0 border-l-0 border-r-0 border-b-secondary mb-0.5">
              {label}
            </SelectLabel>
          ) : null}
          {optionsFormatted.map(option => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              className={optionClassName}
            >
              {option.label}
              {suffix}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </DelayedSelect>
  )
}

export default SelectInput

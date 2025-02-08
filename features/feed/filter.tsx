import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { FeedCursorRouteQueryParams } from '@edenlabs/eden-sdk'
import { FilterIcon } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
  options: {
    label: string
    icon: ReactNode
    value: FeedCursorRouteQueryParams['filter'] // Use the filter type directly here
  }[]
  onChange: (filter: FeedCursorRouteQueryParams['filter']) => void
}

export const Filter = ({ options, onChange }: Props) => {
  // console.log({ options })
  const handleFilterChange = (value: string) => {
    const selectedOption = options.find(
      option => JSON.stringify(option.value) === value,
    )
    if (selectedOption) {
      onChange(selectedOption.value) // Pass the complex object to the parent
    }
  }

  return (
    <div className="flex items-center">
      <Select
        onValueChange={handleFilterChange}
        defaultValue={JSON.stringify(options[0].value)}
      >
        <SelectTrigger className="flex gap-2 min-w-36 justify-end">
          <FilterIcon className="h-3 w-3 text-muted-foreground" />
          <Separator orientation="vertical" />
          <div className="mr-auto">
            <SelectValue placeholder="Feed" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem
              key={`${option.value}_${index}`}
              value={JSON.stringify(option.value)}
            >
              <div className="flex items-center">
                {option.icon}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

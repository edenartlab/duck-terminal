import SelectInput from '@/components/form/input/select-input'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { ToolParameterV2 } from '@edenlabs/eden-sdk'
import { LayoutGridIcon } from 'lucide-react'

type Props = {
  parameter: ToolParameterV2
}

const SampleCountSelector = ({ parameter }: Props) => {
  const { name } = parameter

  return (
    <FormField
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value, name } = field
        return (
          <FormItem className="flex items-center">
            <FormControl id={name}>
              <SelectInput
                placeholder={'Sample Count'}
                label={'Sample Count'}
                onChange={newVal => {
                  if (!newVal) return
                  return onChange(Number(newVal))
                }}
                value={value}
                options={[1, 2, 3, 4]}
                suffix={'x'}
                className={
                  '!mt-0 w-[70px] pl-2.5 pr-1.5 h-[46px] focus:ring-0 font-mono hover:bg-accent'
                }
                optionClassName={'font-mono'}
                icon={<LayoutGridIcon className="h-4 w-4 mr-1" />}
                type="integer"
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )
      }}
    />
  )
}

export default SampleCountSelector

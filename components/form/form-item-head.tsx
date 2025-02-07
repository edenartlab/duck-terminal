import { FormDescription, FormLabel, useFormField } from '@/components/ui/form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
  label: string
  description: string | ReactNode
  icon?: ReactNode
}

const FormItemHead = ({ icon, label, description }: Props) => {
  const { formItemId } = useFormField()

  return (
    <div className="space-y-0.5 flex items-center">
      <FormLabel
        id={`${formItemId}-label`}
        className="flex items-center text-sm first-letter:uppercase mr-2 cursor-pointer"
      >
        {icon}
        {label}
      </FormLabel>
      <FormDescription className="ml-auto">
        <TooltipProvider delayDuration={125}>
          <Tooltip>
            <TooltipTrigger
              className="hover:text-accent-foreground cursor-pointer flex items-center"
              onClick={ev => ev.preventDefault()}
              asChild
            >
              <InfoIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent sideOffset={16} className="max-w-[95dvw]">
              {description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </FormDescription>
    </div>
  )
}

export default FormItemHead

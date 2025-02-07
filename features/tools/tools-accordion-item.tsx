import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import TypographyH5 from '@/components/ui/typography/TypographyH5'
import ToolsGridSection from '@/features/tools/tools-grid-section'
import { ToolV2 } from '@edenlabs/eden-sdk'

// we'll keep ToolsGridSection separate

type ToolsAccordionItemProps = {
  label: string
  value: string
  tools?: ToolV2[]
  priority?: boolean
}

export const ToolsAccordionItem = ({
  label,
  value,
  tools,
  priority,
}: ToolsAccordionItemProps) => {
  return (
    <AccordionItem key={value} value={value} className="bg-popover">
      <AccordionTrigger className="capitalize bg-primary-foreground hover:bg-primary-foreground/60 px-4">
        <TypographyH5 className="capitalize">{label}</TypographyH5>
      </AccordionTrigger>
      <AccordionContent className="my-4 px-4">
        <ToolsGridSection title={label} tools={tools} priority={priority} />
      </AccordionContent>
    </AccordionItem>
  )
}

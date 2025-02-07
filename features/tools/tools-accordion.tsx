'use client'

import { ToolsAccordionItem } from './tools-accordion-item'
import { Accordion } from '@/components/ui/accordion'
import { useToolsListQuery } from '@/hooks/query/use-tools-list-query'
import useLocalStorage from '@/hooks/use-local-storage'
import { siteConfig } from '@/lib/config'
import { ToolOutputTypeV2 } from '@edenlabs/eden-sdk'

// your new reusable component

type ToolsGridProps = {
  output_type: ToolOutputTypeV2[]
  showFeatured?: boolean
}

const ToolsAccordion = ({ output_type, showFeatured }: ToolsGridProps) => {
  const { tools } = useToolsListQuery({ output_type })

  const [accordionStateQuery, setAccordionState] = useLocalStorage<string[]>(
    'generatorsGridAccordionState',
    ['featured', ...output_type],
  )

  const handleAccordionChange = (value: string[]) => {
    setAccordionState(value)
  }

  if (accordionStateQuery.isLoading) {
    return null
  }

  // Separate Eden v2 Tools from Legacy Tools
  const eden2Tools = tools?.filter(tool => !tool.key.includes('legacy'))
  const legacyTools = tools?.filter(tool => tool.key.includes('legacy'))

  return (
    <div>
      <Accordion
        type="multiple"
        defaultValue={
          output_type.length === 1 ? [output_type[0]] : accordionStateQuery.data
        }
        onValueChange={handleAccordionChange}
        className="rounded-md overflow-hidden"
      >
        <div className="p-2 rounded-lg bg-secondary">
          <div className="mb-2">Tools</div>

          <div className="rounded-md overflow-hidden">
            {/* FEATURED */}
            {showFeatured && (
              <ToolsAccordionItem
                label="Featured"
                value="featured"
                tools={tools?.filter(tool =>
                  siteConfig.featured.tools.includes(tool.key),
                )}
                priority
              />
            )}

            {/* REGULAR TOOLS */}
            {output_type.map(type => (
              <ToolsAccordionItem
                key={type}
                label={type}
                value={type}
                tools={eden2Tools?.filter(tool => tool.output_type === type)}
              />
            ))}
          </div>
        </div>
      </Accordion>

      {/* CLASSIC TOOLS */}
      {output_type && output_type[0] !== 'lora' && (
        <div className="p-2 mt-4 rounded-lg bg-secondary">
          <div className="mb-2">Classic Tools</div>
          <Accordion type="multiple" className="rounded-md overflow-hidden">
            {output_type.map(type => {
              const classicTools = legacyTools?.filter(
                tool => tool.output_type === type,
              )
              if (!classicTools || !classicTools.length) return null

              return (
                <ToolsAccordionItem
                  key={type}
                  label={type}
                  value={type}
                  tools={classicTools}
                />
              )
            })}
          </Accordion>
        </div>
      )}
    </div>
  )
}

export default ToolsAccordion

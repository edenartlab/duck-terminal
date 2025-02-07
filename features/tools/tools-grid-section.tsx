import ToolCard from '@/components/card/tool-card'
import { ToolV2 } from '@edenlabs/eden-sdk'

type GridSectionProps = {
  title: string
  tools?: ToolV2[]
  priority?: boolean
}

export const getMediaUrl = (mediaFileName: string) => {
  return `https://d14i3advvh2bvd.cloudfront.net/${mediaFileName}`
}

const ToolsGridSection = ({ tools, priority }: GridSectionProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools && tools.length ? (
        <>
          {tools.map(tool => (
            <ToolCard
              key={tool.key}
              title={tool.name}
              description={tool.description}
              image={getMediaUrl(tool.thumbnail || '')}
              link={`/${
                tool.output_type === 'lora'
                  ? 'train'
                  : `create/${tool.output_type}`
              }/${tool.key}`}
              priority={priority}
            />
          ))}
        </>
      ) : (
        <div>Nothing found here.</div>
      )}
    </div>
  )
}

export default ToolsGridSection

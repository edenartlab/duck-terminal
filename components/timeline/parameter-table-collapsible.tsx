import ModelMiniCard from '@/components/card/model-mini-card'
import LoadingIndicator from '@/components/loading-indicator'
import ParameterTable from '@/components/timeline/parameter-table'
import TaskParameter from '@/components/timeline/task-parameter'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { TaskV2 } from '@edenlabs/eden-sdk'
import { ChevronDownIcon, ComponentIcon, ListIcon } from 'lucide-react'
import { useTimeAgo } from 'next-timeago'
import Link from 'next/link'
import React, { Suspense, useState } from 'react'

type Props = {
  item: TaskV2
}

const ParameterTableCollapsible = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { TimeAgo } = useTimeAgo()

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex text-sm gap-2 items-center mb-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title="Show task configuration"
            className="px-2"
          >
            <ListIcon size={20} />
            <ChevronDownIcon
              size={20}
              className={cn([
                'ml-1 transition-transform duration-200',
                isOpen ? 'rotate-180' : '',
              ])}
            />
          </Button>
        </CollapsibleTrigger>
        <div>
          {item.name ? (
            <TaskParameter name={'prompt'} label={'Name'} value={item.name} />
          ) : null}
          {item.args.prompt || item.args.text_input || item.args.name ? (
            <TaskParameter
              name={'prompt'}
              label={'Prompt'}
              value={
                item.args.prompt || item.args.text_input || item.args.name || ''
              }
            />
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Separator orientation="vertical" className="ml-2 h-9" />
          <div>
            <div className="text-popover-foreground text-xs md:text-sm text-end text-nowrap">
              {item.tool}
            </div>
            <div
              className="text-muted-foreground/50 text-xs text-end text-nowrap"
              title={(
                item.createdAt || new Date('1974-01-01')
              ).toLocaleString()}
            >
              <TimeAgo
                date={(
                  item.createdAt || new Date('1974-01-01')
                ).toLocaleString()}
                locale="en-short"
              />
            </div>
          </div>
        </div>
      </div>
      <CollapsibleContent className="data-[state=open]:animate-none data-[state=closed]:animate-none mb-2">
        <div className="bg-accent rounded-md">
          {item.args.lora ? (
            <Suspense fallback={<LoadingIndicator />}>
              <ModelMiniCard modelId={item.args.lora} className="bg-popover">
                <Button size="sm" variant="outline" asChild>
                  <Link
                    href={`/create/image/${item.tool}?lora=${item.args.lora}`}
                    className="ml-auto mr-2"
                    scroll={false}
                    shallow={true}
                  >
                    <ComponentIcon className="mr-2 h-4 w-4" />
                    Use
                  </Link>
                </Button>
              </ModelMiniCard>
            </Suspense>
          ) : null}
          <ParameterTable taskId={item._id} args={item.args} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default ParameterTableCollapsible

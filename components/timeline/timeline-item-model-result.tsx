import TimelineItemResultTools from '@/components/timeline/timeline-item-result-tools'
import customImageLoader from '@/image-loader'
import { TaskV2, TaskV2Result } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  result: TaskV2Result
  task: TaskV2
  index: number
  queryKey: QueryKey
}

const TimelineItemModelResult = ({ result, task, index, queryKey }: Props) => {
  return (
    <>
      {result.output.map(output => (
        <div key={output.filename} className="p-2 bg-secondary rounded-md ">
          <Link
            href={`/models/${output.model?._id}`}
            className="flex max-h-[60vh] aspect-square rounded-md overflow-hidden"
          >
            <Image
              loader={customImageLoader}
              src={output.thumbnail || ''}
              alt={task.args.name || ''}
              width={1024}
              height={1024}
              className="w-full h-full"
            />
          </Link>
          <TimelineItemResultTools
            result={result}
            output={output}
            task={task}
            index={index}
            queryKey={queryKey}
          />
        </div>
      ))}
    </>
  )
}

export default TimelineItemModelResult

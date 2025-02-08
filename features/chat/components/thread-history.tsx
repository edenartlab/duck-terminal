'use client'

import Image from 'next/image'
import { History } from 'lucide-react'
import {
  useThread
} from '@assistant-ui/react'
import type { FC } from 'react'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { TextContentPart, ImageContentPart, Unstable_AudioContentPart, UIContentPart, ToolCallContentPart } from '@assistant-ui/react'

const isToolCallContentPart = (
  part: TextContentPart | ImageContentPart | Unstable_AudioContentPart | UIContentPart | ToolCallContentPart<Record<string, any>, unknown> // Changed from unknown to any
): part is ToolCallContentPart<Record<string, any>, unknown> => part.type === "tool-call";

const ThreadHistory: FC = () => {
	const allMessages = useThread((m) => m.messages)
	const assistantMessages = allMessages.filter(message => message.role === "assistant")
	const histories = assistantMessages
  .flatMap(message => message.content
    .filter(isToolCallContentPart) // TypeScript now knows it's a ToolCallContentPart
    .map(part => ({
      prompt: part.args?.prompt ?? "",
      filename: (part.result as { result?: { output?: { filename: string }[] }[] })?.result?.[0]?.output?.[0]?.filename ?? ""
    })))
  .reverse();

	
  return (
    <>
			{histories.length > 0 ? (
				<div className="mt-8">
					<div className="flex items-center gap-2 mb-4">
						<History className="w-5 h-5 text-green-400" />
						<h2 className="text-xl font-semibold text-green-400">History</h2>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{histories.map((entry, index) => (
							entry.filename ? (
								<div 
								key={index} 
								className="relative group rounded-lg overflow-hidden border border-green-400/30 hover:border-green-400 transition-colors"
							>
								<Image 
									src={getCloudfrontOriginalUrl(entry.filename)}
									alt={entry.prompt.toString()}
									width={400}
                  height={192}
									className="w-full h-48 object-cover"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
									<p className="text-sm truncate">{entry.prompt.toString()}</p>
								</div>
							</div>
							) : (<></>)
						))}
					</div>
				</div>
			) : <></>}
		</>
  )
}

export default ThreadHistory

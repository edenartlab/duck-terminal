import AgentCard from '@/components/card/agent-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAgentsListQuery } from '@/hooks/query/use-agents-list-query'

type Props = {
  agentIds: string[]
}

export const AgentGridSection = ({ agentIds }: Props) => {
  const { agents } = useAgentsListQuery({ _id: agentIds })

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {agents ? (
        agents.map(agent => (
          <AgentCard
            key={agent._id}
            agent={agent}
            queryKey={['agents', agentIds]}
            className="bg-secondary"
          />
        ))
      ) : (
        <>
          <Skeleton className="min-h-40 w-full" />
          <Skeleton className="min-h-40 w-full" />
          <Skeleton className="min-h-40 w-full" />
        </>
      )}
    </div>
  )
}

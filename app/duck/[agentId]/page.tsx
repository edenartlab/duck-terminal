import DuckChat from '@/features/chat/duck-chat'

type Props = {
  params: {
    agentId: string
  }
}

const DuckChatAgentPage = async ({ params: { agentId } }: Props) => {
  return <DuckChat agentId={agentId} />
}

export default DuckChatAgentPage

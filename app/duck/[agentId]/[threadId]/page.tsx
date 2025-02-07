import DuckChat from '@/features/chat/duck-chat'

type Props = {
  params: {
    agentId: string
    threadId: string
  }
}

const DuckChatAgentThreadPage = async ({
  params: { agentId, threadId },
}: Props) => {
  return <DuckChat agentId={agentId} threadId={threadId} />
}

export default DuckChatAgentThreadPage

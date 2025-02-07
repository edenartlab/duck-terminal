import { EdenRuntimeProvider } from './eden-runtime-provider'
import { describe, expect, it, jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import React from 'react'

// Mock dependencies
jest.mock('@/hooks/use-websocket-message', () => ({
  useWebSocketMessage: jest.fn(),
}))
jest.mock('@/features/chat/hooks/useEdenRuntime', () => ({
  useEdenRuntime: jest.fn(),
}))
jest.mock('@/hooks/query/use-thread-list-query', () => ({
  __esModule: true,
  useThreadListQuery: jest.fn(),
}))
const useThreadListQueryModule = jest.requireMock(
  '@/hooks/query/use-thread-list-query',
)
const mockedUseThreadListQuery = jest.mocked(
  // @ts-ignore
  useThreadListQueryModule.useThreadListQuery,
)
// import { useWebSocketMessage } from '@/hooks/use-websocket-message'

// import { useEdenRuntime } from './eden-runtime-provider'
// import { getThread, sendMessage } from '../path-to-your-component'

// jest.mock('@/hooks/use-websocket-message')
// jest.mock('../path-to-your-component/useEdenRuntime')
// jest.mock('../path-to-your-component/chatApi')

describe('EdenRuntimeProvider', () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

  it('should render children', () => {
    mockedUseThreadListQuery.mockReturnValue({
      threads: [],
      isLoading: false,
      isError: false,
    })

    const queryClient = createTestQueryClient()

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <EdenRuntimeProvider agentId={'123'}>
          <div>Test Child</div>
        </EdenRuntimeProvider>
      </QueryClientProvider>,
    )

    expect(getByText('Test Child')).toBeInTheDocument()
  })

  // it('should handle message emission and yielding', async () => {
  //   const mockMessages = [
  //     { id: '1', content: 'First message', role: 'assistant' },
  //     { id: '2', content: 'Second message', role: 'assistant' },
  //   ]
  //
  //   const mockSendMessage = jest.fn(async () => ({
  //     status: 200,
  //     data: {
  //       thread_id: 'mock-thread-id',
  //     },
  //   }))
  //
  //   const mockUseWebSocketMessage = jest.fn(() => ({
  //       data: {
  //         newMessages: mockMessages,
  //       },
  //     }))
  //
  //     (useWebSocketMessage as jest.Mock).mockImplementation(mockUseWebSocketMessage)
  //   ;(sendMessage as jest.Mock).mockImplementation(mockSendMessage)
  //
  //   const { getByText } = render(
  //     <EdenRuntimeProvider>
  //       <div>Test Child</div>
  //     </EdenRuntimeProvider>,
  //   )
  //
  //   // Wait for effects to run
  //   await act(async () => {})
  //
  //   expect(mockSendMessage).not.toHaveBeenCalled()
  //   expect(getByText('Test Child')).toBeInTheDocument()
  // })
  //
  // it('should handle message updates without duplication', async () => {
  //   const initialMessage = { id: '1', content: 'Initial content', role: 'assistant' }
  //   const updatedMessage = { id: '1', content: 'Updated content', role: 'assistant' }
  //
  //   const mockSendMessage = jest.fn(async () => ({
  //     status: 200,
  //     data: {
  //       thread_id: 'mock-thread-id',
  //     },
  //   }))
  //
  //   const mockUseWebSocketMessage = jest.fn()
  //   ;(useWebSocketMessage as jest.Mock).mockImplementation(mockUseWebSocketMessage)
  //   ;(sendMessage as jest.Mock).mockImplementation(mockSendMessage)
  //
  //   render(
  //     <EdenRuntimeProvider>
  //       <div>Test Child</div>
  //     </EdenRuntimeProvider>,
  //   )
  //
  //   // Emit initial message
  //   await act(async () => {
  //     mockUseWebSocketMessage.mockReturnValueOnce({
  //       data: {
  //         newMessages: [initialMessage],
  //       },
  //     })
  //   })
  //
  //   // Emit updated message
  //   await act(async () => {
  //     mockUseWebSocketMessage.mockReturnValueOnce({
  //       data: {
  //         newMessages: [updatedMessage],
  //       },
  //     })
  //   })
  //
  //   // You can add assertions here to check if the message was updated without duplication
  // })
})

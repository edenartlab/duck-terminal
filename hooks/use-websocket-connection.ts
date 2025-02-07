import useWebSocket from 'react-use-websocket'

export const useWebSocketConnection = (
  endpoint: string,
  shouldConnect: boolean,
  onMessage?: (event: MessageEvent) => void,
) => {
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
    getWebSocket,
    // messageHistory,
  } = useWebSocket(
    endpoint,
    {
      onOpen: () => console.log('WebSocket connected'),
      onReconnectStop: () => console.log('WebSocket onReconnectStop'),
      onClose: e => console.log('WebSocket closed', e),
      onError: e => console.error('WebSocket error', e),
      onMessage: onMessage ? event => onMessage(event) : undefined,
      shouldReconnect: () => shouldConnect,
      heartbeat: {
        message: () => JSON.stringify({ event: 'ping', ts: Date.now() }),
        // interval: 5000,
        // timeout: 30000,
      },
      share: true,
    },
    shouldConnect,
  )

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
    getWebSocket,
    // messageHistory,
  }
}

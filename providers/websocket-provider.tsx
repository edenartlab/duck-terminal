'use client'

import { EdenMessage } from '@/features/chat/eden-message-converter'
import { useWebSocketAuth } from '@/hooks/use-websocket-auth'
import { useWebSocketConnection } from '@/hooks/use-websocket-connection'
import { TaskV2, Thread } from '@edenlabs/eden-sdk'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ReadyState } from 'react-use-websocket'

export type GenericObject = {
  [key: string]: string | boolean | number | GenericObject[]
}

export type JsonMessage = {
  event: string
  data: {
    task?: TaskV2
    thread?: Thread
    active?: string[]
    newMessages?: EdenMessage[]
  } & GenericObject
}

type WebSocketMessageEvent = {
  data: string
  type: string
  target: WebSocket
}

type WebSocketState = {
  sendJsonMessage: (message: JsonMessage) => void
  sendMessage: (message: string) => void
  lastMessage?: WebSocketMessageEvent
  lastMessageJson?: JsonMessage | null
  socket?: WebSocket | null
  readyState: ReadyState
  messageHistory?: WebSocketMessageEvent[]
}

const initialState: WebSocketState = {
  sendJsonMessage: () => undefined,
  sendMessage: () => undefined,
  lastMessage: undefined,
  readyState: ReadyState.CONNECTING,
  messageHistory: [],
}

const WebSocketContext = createContext<WebSocketState>(initialState)
export const useWebSocketContext = () => useContext(WebSocketContext)

type Props = {
  endpoint: string
} & React.PropsWithChildren

export const WebSocketProvider = ({ endpoint, children }: Props) => {
  const [shouldConnect, setShouldConnect] = useState<boolean>(false)
  const {
    getWebSocket,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocketConnection(endpoint, shouldConnect)

  const { isSignedIn } = useWebSocketAuth(sendJsonMessage)

  useEffect(() => {
    setShouldConnect(!!isSignedIn)
  }, [isSignedIn])

  const [lastMessageJson, setLastMessageJson] = useState<JsonMessage | null>(
    null,
  )
  useEffect(() => {
    if (lastMessage?.data) {
      try {
        const parsed = JSON.parse(lastMessage.data)
        setLastMessageJson(parsed)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }
  }, [lastMessage])

  return (
    <WebSocketContext.Provider
      value={{
        socket: getWebSocket() as WebSocket,
        sendJsonMessage,
        sendMessage,
        lastMessage: lastMessage as unknown as WebSocketMessageEvent,
        lastMessageJson,
        readyState,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

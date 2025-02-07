import { AxiosRequestConfig } from 'axios'
import { Character } from 'src/models/Characters'
import { Creator } from 'src/models/Creators'

import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'

// Arguments

export interface SessionsDeleteArguments extends WebAPICallOptions {
  sessionId: string
}

export interface SessionsListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
}

export interface SessionsGetArguments extends WebAPICallOptions {
  sessionId: string
}

export interface SessionEventsListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  sessionId: string
}

export interface SessionsAddUsersArguments extends WebAPICallOptions {
  sessionId: string
  userIds: string[]
}

export interface SessionsAddCharactersArguments extends WebAPICallOptions {
  sessionId: string
  characterIds: string[]
}

export interface SessionsInteractArguments extends WebAPICallOptions {
  character_id: string
  session_id: string
  message: string
  attachments?: string[]
}

// Requests

export const sessionsCreateRequestConfig = (): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'sessions/create',
    data: {},
  }
}
export const sessionsDeleteRequestConfig = (
  args: SessionsDeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'sessions/delete',
    data: {
      ...args,
    },
  }
}

export const sessionsListRequestConfig = (
  args: SessionsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'sessions',
    params,
  }
}

export const sessionsGetRequestConfig = (
  args: SessionsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `sessions/${args.sessionId}`,
  }
}

export const sessionsInteractRequestConfig = (
  args: SessionsInteractArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'sessions/interact',
    data: {
      ...args,
    },
  }
}

export const sessionsAddUsersRequestConfig = (
  args: SessionsAddUsersArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'sessions/users/add',
    data: {
      ...args,
    },
  }
}

export const sessionsAddCharactersRequestConfig = (
  args: SessionsAddCharactersArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'sessions/characters/add',
    data: {
      ...args,
    },
  }
}

export const sessionEventsListRequestConfig = (
  args: SessionEventsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: `sessions/${args.sessionId}/events`,
    params,
  }
}

// Responses

export type SessionsCreateResponse = WebAPICallResult & {
  error?: string
  sessionId?: string
}

export type SessionsDeleteResponse = WebAPICallResult & {
  error?: string
}

export type SessionsListResponse = WebAPICallResult &
  PaginatedResponse<Session> & {
    error?: string
    session?: Session
  }

export type SessionsGetResponse = WebAPICallResult & {
  error?: string
  session?: Session
}

export type SessionsInteractResponse = WebAPICallResult & {
  error?: string
  message?: string
  config?: any
}

export type SessionsAddUsersResponse = WebAPICallResult & {
  error?: string
}

export type SessionsAddCharactersResponse = WebAPICallResult & {
  error?: string
}

export type SessionEventsListResponse = WebAPICallResult &
  PaginatedResponse<SessionEvent> & {
    error?: string
  }

// Types

export enum SessionEventType {
  END_SESSION = 'end_session',
  USERS_ADD = 'users_add',
  CHARACTERS_ADD = 'characters_add',
  INTERACTION = 'interaction',
  CHAT_RESPONSE = 'chat_response',
  CREATION_RESPONSE = 'creation_response',
  ERROR_RESPONSE = 'error_response',
}

export type SessionEventResponseType =
  | SessionEventType.CHAT_RESPONSE
  | SessionEventType.CREATION_RESPONSE
  | SessionEventType.ERROR_RESPONSE

export type Session = {
  id: string
  user: string
  users: Creator[]
  characters: Character[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ChatMessage {
  sender: string
  message: string
}

export interface UsersAddEvent {
  users: string[]
}

export interface CharactersAddEvent {
  characters: string[]
}

export interface InteractionEvent {
  character: string
  message: string
  attachments?: string[]
}

export interface Interaction {
  message: string
  author_id: string
  attachments?: string[]
}

export interface Assistant {
  name: string
  identity: string
  knowledge?: string
  knowledge_summary?: string
}

export interface ChatResponseEvent {
  interaction: string
  message: string
}

export interface CreationResponseEvent {
  interaction: string
  task: string
  creations?: {
    id: string
    uri: string
  }[]
  message?: string
}

export interface ErrorResponseEvent {
  interaction: string
  message: string
  task?: string
}

export interface SessionEvent {
  id?: string
  session?: string
  type?: SessionEventType
  data?: {
    usersAdded?: UsersAddEvent
    characterAdded?: CharactersAddEvent
    interaction?: InteractionEvent
    chatResponse?: ChatResponseEvent
    creationResponse?: CreationResponseEvent
  }
}

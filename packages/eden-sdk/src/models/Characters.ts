// packages/eden-sdk/src/methods/Characters.ts
import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { Creator } from './Creators'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface CharactersListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
}

export interface CharactersGetArguments extends WebAPICallOptions {
  characterId: string
}

export interface CharactersCreateArguments extends WebAPICallOptions {
  name: string
  image?: string
  voice?: string
  greeting?: string
  dialogue?: any[]
  logosData: LogosData
  isPrivate?: boolean
}

export interface CharactersUpdateArguments extends WebAPICallOptions {
  characterId: string
  name?: string
  image?: string
  voice?: string
  greeting?: string
  dialogue?: any[]
  logosData?: LogosData
  isPrivate?: boolean
}

export interface CharactersDeleteArguments extends WebAPICallOptions {
  characterId: string
}

export interface CharactersTestArguments extends WebAPICallOptions {
  name: string
  identity: string
  message: string
  knowledge?: string
  knowledge_summary?: string
  attachments?: string[]
}

export interface CharactersInteractArguments extends WebAPICallOptions {
  sessionId: string
  characterId: string
  message: string
  attachments?: string[]
}

// Requests

export const charactersListRequestConfig = (
  args: CharactersListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams({
    ...args,
  })
  return {
    method: 'GET',
    url: 'characters',
    params,
  }
}

export const charactersGetRequestConfig = (
  args: CharactersGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `characters/${args.characterId}`,
  }
}

export const charactersCreateRequestConfig = (
  args: CharactersCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'characters',
    data: {
      ...args,
    },
  }
}

export const charactersUpdateRequestConfig = (
  args: CharactersUpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `characters/${args.characterId}`,
    data: {
      ...args,
    },
  }
}

export const charactersDeleteRequestConfig = (
  args: CharactersDeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'characters/delete',
    data: {
      ...args,
    },
  }
}

export const charactersTestRequestConfig = (
  args: CharactersTestArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'characters/test',
    data: {
      ...args,
    },
  }
}

export const charactersInteractRequestConfig = (
  args: CharactersInteractArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'characters/interact',
    data: {
      ...args,
    },
  }
}

// Responses

export type CharactersCreateResponse = WebAPICallResult & {
  error?: string
  characterId?: string
}

export type CharactersUpdateResponse = WebAPICallResult & {
  error?: string
  character?: Character
}

export type CharactersDeleteResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CharactersListResponse = WebAPICallResult &
  PaginatedResponse<Character> & {
    error?: string
  }

export type CharactersGetResponse = WebAPICallResult & {
  error?: string
  character?: Character
}

export type CharactersTestResponse = WebAPICallResult & {
  error?: string
  message?: string
  config?: any
}

export type CharactersInteractResponse = WebAPICallResult & {
  error?: string
  message?: string
  config?: any
}

// Types

export type Character = {
  _id: string
  user: Creator
  name: string
  slug: string
  greeting?: string
  dialogue?: any[]
  logosData?: LogosData
  image?: string
  voice?: string
  creationCount?: number
  isPrivate?: boolean
  deleted?: boolean
  createdAt: string
  updatedAt: string
}

export type LogosData = {
  abilities?: {
    [key in Capabilities]?: boolean
  }
  capabilities?: Capabilities[]
  identity?: string
  knowledge?: string
  knowledgeSummary?: string
  concept?: string
  chatModel?: ChatModel
}

export enum Capabilities {
  CREATIONS = 'creations',
  KNOWLEDGE = 'knowledge',
  SMART_REPLY = 'smart_reply',
  STORY_CREATIONS = 'story_creations',
}

export enum ChatModel {
  Gpt35Turbo = 'gpt-3.5-turbo',
  Gpt41106Preview = 'gpt-4-1106-preview',
  GrypheMythomaxL213b8k = 'gryphe/mythomax-l2-13b-8k',
  MistralaiMistralMedium = 'mistralai/mistral-medium',
  MistralaiMixtral8x7bInstruct = 'mistralai/mixtral-8x7b-instruct',
  NousresearchNousHermes2Mixtral8x7bDpo = 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
  NousresearchNousCapybara7b = 'nousresearch/nous-capybara-7b',
  TekniumOpenhermes2Mistral7b = 'teknium/openhermes-2-mistral-7b',
  PygmalionaiMythalion13b = 'pygmalionai/mythalion-13b',
  AnthropicClaude2 = 'anthropic/claude-2',
  CognitiveComputationsDolphinMixtral8x7b = 'cognitivecomputations/dolphin-mixtral-8x7b',
}

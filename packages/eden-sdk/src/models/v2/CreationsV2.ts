import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../../types'
import { ReactionType } from '../Creations'
import { Creator } from '../Creators'
import { MediaOutput, TaskV2 } from './TasksV2'
import { ToolOutputTypeV2 } from './ToolsV2'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface CreationsV2ListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
  name?: string
}

export interface CreationsV2GetArguments extends WebAPICallOptions {
  creationId: string
}

export interface CreationsV2RatingArguments extends WebAPICallOptions {
  creationId: string
  rating: number
}

export interface CreationsV2ReactArguments extends WebAPICallOptions {
  creationId: string
  reaction: ReactionType
}

export interface CreationsV2UnreactArguments extends WebAPICallOptions {
  creationId: string
  reaction: ReactionType
}

export interface CreationsV2DeleteArguments extends WebAPICallOptions {
  creationId: string
}

export interface CreationsV2PatchArguments extends WebAPICallOptions {
  creationId: string
  public?: boolean
  deleted?: boolean
}

export interface CreationsV2BulkPatchArguments extends WebAPICallOptions {
  creationIds: string[]
  public?: boolean
  deleted?: boolean
}

// Requests

export const creationsV2ListRequestConfig = (
  args: CreationsV2ListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'v2/creations',
    params,
  }
}

export const creationsV2GetRequestConfig = (
  args: CreationsV2GetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/creations/${args.creationId}`,
  }
}

export const creationsV2ReactRequestConfig = (
  args: CreationsV2ReactArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/creations/reactions/add',
    data: {
      ...args,
    },
  }
}

export const creationsV2UnreactRequestConfig = (
  args: CreationsV2UnreactArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/creations/reactions/remove',
    data: {
      ...args,
    },
  }
}

export const creationsV2PatchRequestConfig = (
  args: CreationsV2PatchArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `v2/creations/${args.creationId}`,
    data: {
      ...args,
    },
  }
}

export const creationsV2BulkPatchRequestConfig = (
  args: CreationsV2BulkPatchArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `v2/creations/bulk`,
    data: {
      ...args,
    },
  }
}

export const creationsV2DeleteRequestConfig = (
  args: CreationsV2DeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'DELETE',
    url: `v2/creations/${args.creationId}`,
    data: {
      ...args,
    },
  }
}

// Responses

export type CreationsV2ListResponse = WebAPICallResult &
  PaginatedResponse<CreationV2> & {
    error?: string
  }

export type CreationsV2GetResponse = WebAPICallResult & {
  error?: string
  message?: string
  creation?: CreationV2
}

export type CreationsV2ReactResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CreationsV2UnreactResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CreationsV2PatchResponse = WebAPICallResult & {
  error?: string
  creation?: CreationV2
}

export type CreationsV2BulkPatchResponse = WebAPICallResult & {
  error?: string
  creations?: CreationV2[]
}

export type CreationsV2DeleteResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

// Types
export type CreationV2 = MediaOutput & {
  _id: string
  user: Creator
  task: TaskV2
  output_type: ToolOutputTypeV2
  tool: string
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  public?: boolean
}

export interface CreationV2Attributes {
  nsfw_score?: number
  interrogation?: string
}

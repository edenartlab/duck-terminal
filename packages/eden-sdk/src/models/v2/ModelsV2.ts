import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../../types'
import { Creator } from '../Creators'
import { TaskV2 } from './TasksV2'
import { BaseModelName } from './ToolsV2'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface ModelsV2ListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  modelId?: string | string[]
  userId?: string
}

export interface ModelsV2GetArguments extends WebAPICallOptions {
  modelId: string
}

export interface ModelsV2PatchArguments extends WebAPICallOptions {
  modelId: string
  public?: boolean
  deleted?: boolean
}

// Requests
export const modelsV2ListRequestConfig = (
  args: ModelsV2ListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'v2/models',
    params,
  }
}

export const modelsV2GetRequestConfig = (
  args: ModelsV2GetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/models/${args.modelId}`,
  }
}

export const modelsV2PatchRequestConfig = (
  args: ModelsV2PatchArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `v2/models/${args.modelId}`,
    data: {
      ...args,
    },
  }
}
// Responses

export type ModelsV2ListResponse = WebAPICallResult &
  PaginatedResponse<ModelV2> & {
    error?: string
  }

export type ModelsV2GetResponse = WebAPICallResult & {
  error?: string
  model?: ModelV2
}

export type ModelsV2PatchResponse = WebAPICallResult & {
  error?: string
  model?: ModelV2
}

// Types

export type ModelV2 = {
  _id: string
  name: string
  user: Creator
  task: TaskV2
  thumbnail: string
  slug: string
  checkpoint: string
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  public?: boolean
  base_model?: BaseModelName
}

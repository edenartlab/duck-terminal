import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../../types'
import { Creator } from '../Creators'
import { MediaAttributes } from '../Media'
import { CreationV2 } from './CreationsV2'
import { ModelV2 } from './ModelsV2'
import { ToolOutputTypeV2 } from './ToolsV2'
import { AxiosRequestConfig } from 'axios'

// Arguments
export interface TasksV2CreateArguments extends WebAPICallOptions {
  tool: string
  args?: any
}

export interface TasksV2ListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  taskId?: string | string[]
  status?: string | string[]
  type?: 'concepts' | 'creations'
  output_type?: ToolOutputTypeV2
  tool?: string
  minDate?: boolean
}

export interface TasksV2GetArguments extends WebAPICallOptions {
  taskId: string
}

export interface TasksV2CancelArguments extends WebAPICallOptions {
  taskId: string
}

export interface TasksV2PublishArguments extends WebAPICallOptions {
  taskId: string
  resultFilename: string
}

// Requests

export const tasksV2CreateRequestConfig = (
  args: TasksV2CreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/tasks/create',
    data: {
      ...args,
    },
  }
}

export const tasksV2CostRequestConfig = (
  args: TasksV2CreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/tasks/cost',
    data: {
      ...args,
    },
  }
}

export const tasksV2ListRequestConfig = (
  args: TasksV2ListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'v2/tasks',
    params,
  }
}

export const tasksV2GetRequestConfig = (
  args: TasksV2GetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/tasks/${args.taskId}`,
  }
}

export const tasksV2CancelRequestConfig = (
  args: TasksV2CancelArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/tasks/cancel',
    data: {
      ...args,
    },
  }
}

export const tasksV2PublishRequestConfig = (
  args: TasksV2PublishArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/tasks/publish',
    data: {
      ...args,
    },
  }
}

// Responses

export type TasksV2CreateResponse = WebAPICallResult &
  (
    | {
        error?: string
        message?: string
      }
    | { task: TaskV2 }
  )

export type TasksV2ListResponse = WebAPICallResult &
  PaginatedResponse<TaskV2> & {
    error?: string
  }

export type TasksV2GetResponse = WebAPICallResult & {
  error?: string
  task?: TaskV2
}

export type TasksV2CancelResponse = WebAPICallResult & {
  error?: string
  taskStatus?: TaskV2['status']
}

export type TasksV2PublishResponse = WebAPICallResult & {
  error?: string
  creation?: CreationV2
}

// Types

export enum TaskV2Status {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export type TaskV2Args = {
  // creations
  prompt?: string
  negative_prompt?: string
  text_input?: string
  width?: number
  height?: number
  seed?: number
  lora?: string | null
  lora_strength?: number
  n_samples?: number
  num_outputs?: number
  image?: string
  // models
  name?: string
  lora_training_urls?: string[]
  sd_model_version?: string
  concept_mode?: string
  max_train_steps?: number
  resolution?: number
}

export type MediaOutput = {
  url?: string
  thumbnail?: string
  filename: string
  mediaAttributes?: MediaAttributes
}

export type TasksV2ResultOutput = MediaOutput & {
  mediaAttributes?: MediaAttributes & { type: ToolOutputTypeV2 }
  model?: ModelV2
  creation?: CreationV2
}

export type TaskV2Result = {
  output: TasksV2ResultOutput[]
  intermediate_outputs?: {
    inpaint_preview?: MediaOutput[]
    controlnet_signal?: MediaOutput[]
    // audio_stems
    isolated_bass?: MediaOutput[]
    isolated_drums?: MediaOutput[]
    isolated_other?: MediaOutput[]
    isolated_vocals?: MediaOutput[]
  }
  metadata?: string | null
}

export type TaskV2 = {
  _id: string
  user: Creator
  tool: string
  output_type?: ToolOutputTypeV2
  model?: string
  name?: string
  args: TaskV2Args
  status: TaskV2Status
  error: string | null
  result: TaskV2Result[]
  createdAt: Date
  updatedAt: Date
}

export interface TaskV2Attributes {
  discordId?: string
  delegateUserId?: string
}

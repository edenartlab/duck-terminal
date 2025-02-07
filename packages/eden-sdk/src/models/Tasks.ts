import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { Generator } from './Generators'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface TasksCreateArguments extends WebAPICallOptions {
  generatorName: string
  versionId?: string
  config?: any
  metadata?: any
  attributes?: TaskAttributes
}

export interface TasksListArguments extends WebAPICallOptions, ListQueryParams {
  status?: string | string[]
  taskId?: string | string[]
  type?: 'concepts' | 'creations'
}

export interface TasksGetArguments extends WebAPICallOptions {
  taskId: string
}

// Requests

export const tasksCreateRequestConfig = (
  args: TasksCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'tasks/create',
    data: {
      ...args,
    },
  }
}

export const tasksCostRequestConfig = (
  args: TasksCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'tasks/cost',
    data: {
      ...args,
    },
  }
}

export const tasksListRequestConfig = (
  args: TasksListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'tasks',
    params,
  }
}

export const tasksGetRequestConfig = (
  args: TasksGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `tasks/${args.taskId}`,
  }
}

// Responses

export type TasksCreateResponse = WebAPICallResult & {
  error?: string
  message?: string
  taskId?: string
}

export type TasksListResponse = WebAPICallResult &
  PaginatedResponse<Task> & {
    error?: string
  }

export type TasksGetResponse = WebAPICallResult & {
  error?: string
  task?: Task
}

// Types

export type Task = {
  _id: string
  user: string
  character?: string
  generator: Generator
  versionId: string
  config?: any
  metadata?: any
  cost: number
  taskId: string
  status: string
  error?: string
  progress?: number
  output?: any
  intermediate_outputs?: any[]
  creation?: any
  samples?: any[]
  concept?: string
  attributes?: TaskAttributes
  createdAt: string
  updatedAt: string
}

export interface TaskAttributes {
  discordId?: string
  delegateUserId?: string
}

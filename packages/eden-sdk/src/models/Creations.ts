import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { MediaAttributes } from './Media'
import { AxiosRequestConfig } from 'axios'
import { Creator } from 'src/models/Creators'
import { Task } from 'src/models/Tasks'

// Arguments

export interface CreationsListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
  name?: string
}

export interface CreationsGetArguments extends WebAPICallOptions {
  creationId: string
}

export interface CreationsRatingArguments extends WebAPICallOptions {
  creationId: string
  rating: number
}

export interface CreationsReactArguments extends WebAPICallOptions {
  creationId: string
  reaction: ReactionType
}

export interface CreationsUnreactArguments extends WebAPICallOptions {
  creationId: string
  reaction: ReactionType
}

export interface CreationsDeleteArguments extends WebAPICallOptions {
  creationId: string
}

export interface CreationsUpdateArguments extends WebAPICallOptions {
  creationId: string
  isPrivate: boolean
}

// Requests

export const creationsListRequestConfig = (
  args: CreationsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'creations',
    params,
  }
}

export const creationsGetRequestConfig = (
  args: CreationsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `creations/${args.creationId}`,
  }
}

export const creationsReactRequestConfig = (
  args: CreationsReactArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'creations/reactions/add',
    data: {
      ...args,
    },
  }
}

export const creationsUnreactRequestConfig = (
  args: CreationsUnreactArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'creations/reactions/remove',
    data: {
      ...args,
    },
  }
}

export const creationsUpdateRequestConfig = (
  args: CreationsUpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `creations/${args.creationId}`,
    data: {
      ...args,
    },
  }
}

export const creationsDeleteRequestConfig = (
  args: CreationsDeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'DELETE',
    url: `creations/${args.creationId}`,
    data: {
      ...args,
    },
  }
}

// Responses

export type CreationsListResponse = WebAPICallResult &
  PaginatedResponse<Creation> & {
    error?: string
  }

export type CreationsGetResponse = WebAPICallResult & {
  error?: string
  message?: string
  creation?: Creation
}

export type CreationsReactResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CreationsUnreactResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CreationsUpdateResponse = WebAPICallResult & {
  error?: string
  creation?: Creation
}

export type CreationsDeleteResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

// Types

export type Reactions = Record<string, boolean>

export type Creation = {
  _id: string
  user: Creator
  character?: string
  userId?: string
  task: Task
  samples?: string[]
  parent?: string
  delegateUser?: string
  delegateHasClaimed?: boolean
  uri: string
  mediaUri?: string
  thumbnail?: string
  name: string
  attributes: CreationAttributes
  mediaAttributes: MediaAttributes
  creationCount?: number
  praiseCount?: number
  bookmarkCount?: number
  bookmarked?: boolean
  reactions?: Reactions
  deleted?: boolean
  isPrivate?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreationAttributes {
  nsfw_score?: number
  interrogation?: string
}

export enum ReactionType {
  Praise = 'praise',
}

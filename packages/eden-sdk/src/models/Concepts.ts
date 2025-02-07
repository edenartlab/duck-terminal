import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { AxiosRequestConfig } from 'axios'
import { ReactionType, Reactions } from 'src/models/Creations'
import { Creator } from 'src/models/Creators'
import { Task } from 'src/models/Tasks'

// Arguments

export interface ConceptsListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
  name?: string
}

export interface ConceptsGetArguments extends WebAPICallOptions {
  conceptId: string
}

export interface ConceptsReactArguments extends WebAPICallOptions {
  conceptId: string
  reaction: ReactionType
}

export interface ConceptsUnreactArguments extends WebAPICallOptions {
  conceptId: string
  reaction: ReactionType
}

export interface ConceptsDeleteArguments extends WebAPICallOptions {
  conceptId: string
}

export interface ConceptsUpdateArguments extends WebAPICallOptions {
  conceptId: string
  description?: string
  isPrivate?: boolean
}

// Requests

export const conceptsListRequestConfig = (
  args: ConceptsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'concepts',
    params,
  }
}

export const conceptsGetRequestConfig = (
  args: ConceptsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `concepts/${args.conceptId}`,
  }
}

export const conceptsReactRequestConfig = (
  args: ConceptsReactArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'concepts/reactions/add',
    data: {
      ...args,
    },
  }
}

export const conceptsUnreactRequestConfig = (
  args: ConceptsUnreactArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'concepts/reactions/remove',
    data: {
      ...args,
    },
  }
}

export const conceptsUpdateRequestConfig = (
  args: ConceptsUpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `concepts/${args.conceptId}`,
    data: {
      ...args,
    },
  }
}

export const conceptsDeleteRequestConfig = (
  args: ConceptsDeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'DELETE',
    url: `concepts/${args.conceptId}`,
    data: {
      ...args,
    },
  }
}

// Responses

export type ConceptsListResponse = WebAPICallResult &
  PaginatedResponse<Concept> & {
    error?: string
  }

export type ConceptsGetResponse = WebAPICallResult & {
  error?: string
  concept?: Concept
}

export type ConceptsReactResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type ConceptsUnreactResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type ConceptsUpdateResponse = WebAPICallResult & {
  error?: string
  concept?: Concept
}

export type ConceptsDeleteResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

// Types

export type Concept = {
  _id: string
  user: Creator
  task: Task
  userId?: string
  parent?: string
  uri: string
  thumbnail?: string
  training_images?: string[]
  grid_prompts?: string[]
  num_training_images?: number
  checkpoint?: string
  name: string
  description?: string
  publicName: string
  conceptName: string
  attributes: any
  publishedUrl?: string
  creationCount?: number
  praiseCount?: number
  bookmarkCount?: number
  bookmarked?: boolean
  reactions?: Reactions
  createdAt: string
  updatedAt: string
  isPrivate?: boolean
  deleted?: boolean
}

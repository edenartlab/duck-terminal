import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { Creator } from './Creators'
import { AxiosRequestConfig } from 'axios'
import { Creation } from 'src/models/Creations'

// Arguments

export interface CollectionsCreateArguments extends WebAPICallOptions {
  name: string
  description?: string
  creationIds?: string[]
  isPrivate?: boolean
}

export interface CollectionsUpdateArguments extends WebAPICallOptions {
  collectionId: string
  name?: string
  description?: string
  isPrivate?: boolean
  deleted?: boolean
}

export interface CollectionsDeleteArguments extends WebAPICallOptions {
  collectionId: string
}

export interface CollectionsAddCreationsArguments extends WebAPICallOptions {
  collectionId: string
  creationIds: string[]
}

export interface CollectionsRemoveCreationsArguments extends WebAPICallOptions {
  collectionId: string
  creationIds: string[]
}

export interface CollectionsListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
  creationId?: string | string[]
}

export interface CollectionsGetArguments extends WebAPICallOptions {
  collectionId: string
}

// Requests

export const collectionsCreateRequestConfig = (
  args: CollectionsCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'collections/create',
    data: {
      ...args,
    },
  }
}

export const collectionsUpdateRequestConfig = (
  args: CollectionsUpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `collections/${args.collectionId}`,
    data: {
      ...args,
    },
  }
}

export const collectionsDeleteRequestConfig = (
  args: CollectionsDeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'DELETE',
    url: `collections/${args.collectionId}`,
    data: {
      ...args,
    },
  }
}

export const collectionsListRequestConfig = (
  args: CollectionsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'collections',
    params,
  }
}

export const collectionsGetRequestConfig = (
  args: CollectionsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `collections/${args.collectionId}`,
  }
}

export const collectionsAddCreationsRequestConfig = (
  args: CollectionsAddCreationsArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'collections/creations/add',
    data: {
      ...args,
    },
  }
}

export const collectionsRemoveCreationsRequestConfig = (
  args: CollectionsRemoveCreationsArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'collections/creations/remove',
    data: {
      ...args,
    },
  }
}

// Responses

export type CollectionsCreateResponse = WebAPICallResult & {
  error?: string
  collectionId?: string
}

export type CollectionsUpdateResponse = WebAPICallResult & {
  error?: string
  characterId?: string
}

export type CollectionsDeleteResponse = WebAPICallResult & {
  error?: string
}

export type CollectionsAddCreationsResponse = WebAPICallResult & {
  error?: string
}

export type CollectionsRemoveCreationsResponse = WebAPICallResult & {
  error?: string
}

export type CollectionsListResponse = WebAPICallResult &
  PaginatedResponse<Collection> & {
    error?: string
  }

export type CollectionsGetResponse = WebAPICallResult & {
  error?: string
  collection: Collection
}

// Types

export type Collection = {
  _id: string
  user: Creator
  name: string
  description: string
  isDefaultCollection: boolean
  creations: Creation[]
  displayImageUri?: string
  creationCount?: number
  creatorId?: string
  creatorName?: string
  creatorImage?: string
  contributors?: string[]
  hasItem?: boolean
  deleted?: boolean
  isPrivate?: boolean
  createdAt: string
  updatedAt: string
}

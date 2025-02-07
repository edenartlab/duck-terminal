import { AxiosRequestConfig } from 'axios'
import { Creator } from 'src/models/Creators'
import { CreationV2 } from 'src/models/v2/CreationsV2'
import { WebAPICallOptions, WebAPICallResult } from 'src/types'

// Types
export type CollectionV2 = {
  _id: string
  user: Creator
  name: string
  description?: string
  creations: CreationV2[]
  contributors?: Creator[]
  coverCreation?: CreationV2
  createdAt: Date
  updatedAt: Date
  deleted?: boolean
  public?: boolean
}

// Arguments
export interface CollectionsV2GetLightArguments extends WebAPICallOptions {}

export interface CollectionsV2GetArguments extends WebAPICallOptions {
  collectionId: string
}

export interface CollectionsV2CreateArguments extends WebAPICallOptions {
  name: string
  description?: string
  creationIds?: string[]
  public?: boolean
}

export interface CollectionsV2UpdateArguments extends WebAPICallOptions {
  collectionId: string
  name?: string
  description?: string
  public?: boolean
}

export interface CollectionsV2DeleteArguments extends WebAPICallOptions {
  collectionId: string
}

export interface CollectionsV2AddCreationsArguments extends WebAPICallOptions {
  collectionId: string
  creationIds: string[]
}

export interface CollectionsV2RemoveCreationsArguments
  extends WebAPICallOptions {
  collectionId: string
  creationIds: string[]
}

// Requests
export const collectionsV2GetLightRequestConfig = (
  args: CollectionsV2GetLightArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: 'v2/collections/light',
    params: args,
  }
}

export const collectionsV2GetRequestConfig = (
  args: CollectionsV2GetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/collections/${args.collectionId}`,
  }
}

export const collectionsV2CreateRequestConfig = (
  args: CollectionsV2CreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/collections',
    data: args,
  }
}

export const collectionsV2UpdateRequestConfig = (
  args: CollectionsV2UpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `v2/collections/${args.collectionId}`,
    data: args,
  }
}

export const collectionsV2DeleteRequestConfig = (
  args: CollectionsV2DeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'DELETE',
    url: `v2/collections/${args.collectionId}`,
  }
}

export const collectionsV2AddCreationsRequestConfig = (
  args: CollectionsV2AddCreationsArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `v2/collections/${args.collectionId}/creations/add`,
    data: args,
  }
}

export const collectionsV2RemoveCreationsRequestConfig = (
  args: CollectionsV2RemoveCreationsArguments,
): AxiosRequestConfig => {
  return {
    method: 'PATCH',
    url: `v2/collections/${args.collectionId}/creations/remove`,
    data: args,
  }
}

// Responses
export interface CollectionsV2GetLightResponse extends WebAPICallResult {
  collections: {
    _id: string
    name: string
    creations: string[]
    public: boolean
    contributors: string[]
  }[]
  error?: string
}

export type CollectionsV2GetResponse = WebAPICallResult & {
  collection: CollectionV2
  error?: string
}

export type CollectionsV2CreateResponse = WebAPICallResult & {
  collectionId: string
  error?: string
}

export type CollectionsV2UpdateResponse = WebAPICallResult & {
  collectionId?: string
  error?: string
}

export type CollectionsV2DeleteResponse = WebAPICallResult & {
  error?: string
}

export type CollectionsV2AddCreationsResponse = WebAPICallResult & {
  collectionId?: string
  error?: string
}

export type CollectionsV2RemoveCreationsResponse = WebAPICallResult & {
  collectionId?: string
  error?: string
}

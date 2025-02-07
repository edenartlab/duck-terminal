import {
  ListCursorQueryParams,
  PaginatedCursorResponse,
  transformArgsIntoURLParams,
} from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { Concept } from './Concepts'
import { Creation } from './Creations'
import { BaseModelName } from './v2'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface FeedCreationsBaseArguments extends WebAPICallOptions {
  userId?: string | string[]
  creationId?: string
  characterId?: string | string[]
  collectionId?: string | string[]
  conceptId?: string | string[]
  generatorId?: string | string[]
  outputType?: string | string[]
  output_type?: string | string[]
  isPrivate?: string
  name?: string
  maxDate?: string
  minDate?: string
  orderBy?: string
  direction?: 1 | -1
}

interface FeedConceptsBaseArguments extends WebAPICallOptions {
  userId?: string | string[]
  collectionId?: string | string[]
  name?: string
  maxDate?: string
  minDate?: string
  orderBy?: string
  direction?: 1 | -1
  creationId?: string
  characterId?: string | string[]
  isPrivate?: string
}

interface FeedCreatorsBaseArguments extends WebAPICallOptions {
  userId?: string | string[]
  name?: string
  maxDate?: string
  minDate?: string
  orderBy?: string
}

export type CursorPaginatedRouteQueryParams = {
  cursor?: string
  nextValue?: number
  limit?: number
  orderBy?: string
}

export type FeedCursorRouteQueryParams = {
  sort?: string | string[]
  filter?: {
    _id?: string | string[]
    sort?: string | string[]
    limit?: number
    name?: string | string[]
    user?: string | string[]
    owner?: string | string[]
    character?: string | string[]
    collection?: string | string[]
    creation?: string | string[]
    generator?: string | string[]
    tool?: string | string[]
    outputType?: string | string[]
    output_type?: string | string[]
    concept?: string | string[]
    isPrivate?: boolean
    visibility?: 'all' | 'public' | 'private'
    maxDate?: string
    minDate?: string
    base_model?: BaseModelName | BaseModelName[]
  }
}

export type CursorPaginatedFeedQuery = FeedCursorRouteQueryParams &
  CursorPaginatedRouteQueryParams

export interface FeedCreationsArguments
  extends FeedCreationsBaseArguments,
    ListQueryParams {}

export interface FeedCreationsCursorArguments
  extends FeedCreationsBaseArguments,
    ListCursorQueryParams {}

export interface FeedConceptsCursorArguments
  extends FeedConceptsBaseArguments,
    ListCursorQueryParams {}

export interface FeedCreatorsCursorArguments
  extends FeedCreatorsBaseArguments,
    ListCursorQueryParams {}

export interface FeedConceptsArguments
  extends FeedConceptsBaseArguments,
    ListQueryParams {}

export interface FeedCharactersArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
  name?: string
}

export interface FeedCreatorsArguments
  extends WebAPICallOptions,
    ListQueryParams {
  name?: string
}

// Requests

export const feedCreationsRequestConfig = (
  args: FeedCreationsArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'feed/creations',
    params,
  }
}

export const feedCursorCreationsRequestConfig = (
  args: FeedCreationsCursorArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'feed-cursor/creations',
    params,
  }
}

export const feedConceptsRequestConfig = (
  args: FeedConceptsArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'feed/concepts',
    params,
  }
}

export const feedCursorConceptsRequestConfig = (
  args: FeedCreationsArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'feed-cursor/concepts',
    params,
  }
}

// Responses

export type FeedCreationsCursorResponse = WebAPICallResult &
  PaginatedCursorResponse<Creation> & {
    error?: string
    reactions?: {
      [creationId: string]: {
        [reaction: string]: number
      }
    }
    bookmarks?: {
      [creationId: string]: boolean
    }
  }

export type FeedCreationsResponse = WebAPICallResult &
  PaginatedResponse<Creation> & {
    error?: string
    reactions?: {
      [creationId: string]: {
        [reaction: string]: number
      }
    }
    bookmarks?: {
      [creationId: string]: boolean
    }
  }

export type FeedConceptsResponse = WebAPICallResult &
  PaginatedResponse<Concept> & {
    error?: string
    reactions?: {
      [conceptId: string]: {
        [reaction: string]: number
      }
    }
    bookmarks?: {
      [conceptId: string]: boolean
    }
  }

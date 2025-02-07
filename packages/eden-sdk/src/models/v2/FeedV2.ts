import {
  PaginatedCursorResponse,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../../types'
import { CursorPaginatedFeedQuery } from '../Feed'
import { Agent } from './Agents'
import { CollectionV2 } from './CollectionsV2'
import { CreationV2 } from './CreationsV2'
import { ModelV2 } from './ModelsV2'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface FeedCreationsV2BaseArguments extends WebAPICallOptions {
  userId?: string | string[]
  creationId?: string
  characterId?: string | string[]
  collectionId?: string | string[]
  conceptId?: string | string[]
  generatorId?: string | string[]
  output_type?: string | string[]
  isPrivate?: string
  name?: string
  maxDate?: string
  minDate?: string
  orderBy?: string
  direction?: 1 | -1
}

//
// interface FeedConceptsV2BaseArguments extends WebAPICallOptions {
//   userId?: string | string[]
//   collectionId?: string | string[]
//   name?: string
//   maxDate?: string
//   minDate?: string
//   orderBy?: string
//   direction?: 1 | -1
//   creationId?: string
//   characterId?: string | string[]
//   isPrivate?: string
// }
//
// interface FeedCreatorsV2BaseArguments extends WebAPICallOptions {
//   userId?: string | string[]
//   name?: string
//   maxDate?: string
//   minDate?: string
//   orderBy?: string
// }

// export type CursorPaginatedFeedQuery = FeedCursorRouteQueryParams &
//   CursorPaginatedRouteQueryParams

export interface FeedCreationsV2CursorArguments
  extends CursorPaginatedFeedQuery {}

export interface FeedCollectionsV2CursorArguments
  extends CursorPaginatedFeedQuery {
  user?: string
  name?: string
  orderBy?: string
  direction?: 1 | -1
}

export interface FeedAgentCursorArguments extends CursorPaginatedFeedQuery {
  user?: string
  name?: string
  orderBy?: string
  direction?: 1 | -1
}

// export interface FeedConceptsCursorArguments
//   extends FeedCreationsV2Arguments,
//     ListCursorQueryParams {}

// export interface FeedCreatorsCursorArguments
//   extends FeedCreatorsBaseArguments,
//     ListCursorQueryParams {}

// export interface FeedConceptsArguments
//   extends FeedConceptsBaseArguments,
//     ListQueryParams {}

// export interface FeedCharactersArguments
//   extends WebAPICallOptions,
//     ListQueryParams {
//   userId?: string | string[]
//   name?: string
// }

// export interface FeedCreatorsArguments
//   extends WebAPICallOptions,
//     ListQueryParams {
//   name?: string
// }

// Requests

export const feedCursorCreationsV2RequestConfig = (
  args: FeedCreationsV2CursorArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'v2/feed-cursor/creations',
    params,
  }
}

export const feedCursorCollectionsV2RequestConfig = (
  args: FeedCollectionsV2CursorArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'v2/feed-cursor/collections',
    params,
  }
}

export const feedCursorAgentRequestConfig = (
  args: FeedAgentCursorArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'v2/feed-cursor/agents',
    params,
  }
}

// export const feedConceptsRequestConfig = (
//   args: FeedConceptsArguments,
// ): AxiosRequestConfig => {
//   const params = transformArgsIntoURLParams(args)
//   return {
//     method: 'GET',
//     url: 'feed/concepts',
//     params,
//   }
// }

// export const feedCursorConceptsRequestConfig = (
//   args: FeedCreationsArguments,
// ): AxiosRequestConfig => {
//   const params = transformArgsIntoURLParams(args)
//   return {
//     method: 'GET',
//     url: 'feed-cursor/concepts',
//     params,
//   }
// }

// Responses

export type FeedV2CursorResponse = WebAPICallResult &
  PaginatedCursorResponse<ModelV2 | CreationV2 | Agent> & {
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

export type FeedCreationsV2CursorResponse = WebAPICallResult &
  PaginatedCursorResponse<CreationV2> & {
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

export type FeedCreationsV2Response = WebAPICallResult &
  PaginatedResponse<CreationV2> & {
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

export type FeedCollectionsV2CursorResponse = WebAPICallResult &
  PaginatedCursorResponse<CollectionV2> & {
    error?: string
  }

export type FeedAgentCursorResponse = WebAPICallResult &
  PaginatedCursorResponse<Agent> & {
    error?: string
  }

//
// export type FeedConceptsResponse = WebAPICallResult &
//   PaginatedResponse<Concept> & {
//   error?: string
//   reactions?: {
//     [conceptId: string]: {
//       [reaction: string]: number
//     }
//   }
//   bookmarks?: {
//     [conceptId: string]: boolean
//   }
// }

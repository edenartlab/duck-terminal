import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { AxiosRequestConfig } from 'axios'

// Arguments

export type ApiKeysListArguments = WebAPICallOptions & ListQueryParams

export interface ApiKeysCreateArguments extends WebAPICallOptions {
  note?: string
}

export interface ApiKeysDeleteArguments extends WebAPICallOptions {
  apiKey: string
}

// Requests

export const apiKeysListRequestConfig = (
  args: ApiKeysListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams({
    ...args,
  })
  return {
    method: 'GET',
    url: 'apikeys',
    params,
  }
}

export const apiKeysCreateRequestConfig = (
  args: ApiKeysCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'apikeys/create',
    data: {
      note: args.note,
    },
  }
}

export const apiKeysDeleteRequestConfig = (
  args: ApiKeysDeleteArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'apikeys/delete',
    data: {
      ...args,
    },
  }
}

// Responses

export type ApiKeysCreateResponse = WebAPICallResult & {
  error?: string
  apiKey?: {
    apiKey?: string
    apiSecret?: string
  }
}

export type ApiKeysDeleteResponse = WebAPICallResult & {
  error?: string
}

export type ApiKeysListResponse = WebAPICallResult &
  PaginatedResponse<ApiKey> & {
    error?: string
  }

// Types

export type ApiKey = {
  apiKey: string
  apiSecret?: string
  note: string
  createdAt: string
}

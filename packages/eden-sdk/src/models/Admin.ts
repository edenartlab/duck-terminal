import {
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../types'
import { AxiosRequestConfig } from 'axios'
import { ApiKey } from 'src/models/ApiKeys'

export interface AdminMannaModifyArguments extends WebAPICallOptions {
  userId: string
  amount: number
}

export interface AdminMannaVouchersCreateArguments extends WebAPICallOptions {
  amount: number
  allowedUserIds?: string[]
  numberOfUses?: number
  code?: string
}

export interface AdminAuthChallengeArguments extends WebAPICallOptions {
  address: string
  isWeb2: boolean
}

export interface AdminMediaUploadArguments extends WebAPICallOptions {
  media: Buffer
}

export interface AdminConceptsExportToHFArguments extends WebAPICallOptions {
  conceptId: string
  userId: string
}

export interface AdminConceptsRemoveFromHFArguments extends WebAPICallOptions {
  conceptId: string
  userId: string
}

export interface AdminApiKeysListArguments extends WebAPICallOptions {
  character: string | string[]
}

// Requests

export const adminMannaModifyRequestConfig = (
  args: AdminMannaModifyArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'admin/manna/modify',
    data: {
      ...args,
    },
  }
}

export const adminMannaVouchersCreateRequestConfig = (
  args: AdminMannaVouchersCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'admin/manna/vouchers/create',
    data: {
      ...args,
    },
  }
}

export const adminAuthChallengeRequestConfig = (
  args: AdminAuthChallengeArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'admin/auth/challenge',
    data: {
      ...args,
    },
  }
}

export const adminMediaUploadRequestConfig = (
  args: AdminMediaUploadArguments,
) => {
  const blob = new Blob([args.media])
  const form = new FormData()
  form.append('file', blob)
  return {
    method: 'POST',
    url: 'media/upload',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
}

export const adminConceptsExportToHFRequestConfig = (
  args: AdminConceptsExportToHFArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: `admin/concepts/export/hf`,
    data: {
      ...args,
    },
  }
}

export const adminConceptsRemoveFromHFRequestConfig = (
  args: AdminConceptsRemoveFromHFArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: `admin/concepts/remove/hf`,
    data: {
      ...args,
    },
  }
}

export const adminApiKeysListRequestConfig = (
  args: AdminApiKeysListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'admin/apikeys',
    params,
  }
}

// Responses

export type AdminMannaModifyResponse = WebAPICallResult & {
  error?: string
  userId?: string
  manna?: number
  transactionId?: string
}

export type AdminMannaVouchersCreateResponse = WebAPICallResult & {
  error?: string
  code?: string
}

export type AdminAuthChallengeResponse = WebAPICallResult & {
  error?: string
  nonce?: string
}

export type AdminMediaUploadResponse = WebAPICallResult & {
  error?: string
  url?: string
}

export type AdminConceptsExportToHFResponse = WebAPICallResult & {
  error?: string
  url?: string
}

export type AdminConceptsRemoveFromHFResponse = WebAPICallResult & {
  error?: string
}

export type AdminApiKeysListResponse = WebAPICallResult &
  PaginatedResponse<ApiKey> & {
    error?: string
  }

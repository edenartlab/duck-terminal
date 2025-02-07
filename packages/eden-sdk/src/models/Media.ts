import { WebAPICallOptions, WebAPICallResult } from '../types'

export interface MediaAttributes {
  type: string
  mimeType: string
  duration?: number
  width?: number
  height?: number
  aspectRatio?: number
  blurhash?: string
}

export enum MediaType {
  Image = 'image',
  Video = 'video',
  Text = 'text',
  Audio = 'audio',
  Zip = 'zip',
  Model = 'model',
  Unknown = 'unknown',
}

// Arguments

export interface MediaUploadArguments extends WebAPICallOptions {
  media: Buffer
}

export interface MediaBulkDownloadArguments extends WebAPICallOptions {
  files: {
    url: string
    fileName: string
    fileExtension?: string
  }
}

// Requests

export const mediaUploadRequestConfig = (args: MediaUploadArguments) => {
  const blob = new Blob([args.media])
  const form = new FormData()
  form.append('file', blob)
  return {
    method: 'POST',
    url: '/media/upload',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
}

export const mediaBulkDownloadRequestConfig = (
  args: MediaBulkDownloadArguments,
) => {
  return {
    method: 'POST',
    url: '/media/download/bulk',
    data: {
      ...args,
    },
  }
}

// Responses

export type MediaUploadResponse = WebAPICallResult & {
  error?: string
  url?: string
}

export type MediaBulkDownloadResponse = WebAPICallResult & {
  error?: string
  signedUrls?: string[]
}

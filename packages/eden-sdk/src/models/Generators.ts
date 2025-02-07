import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../types'
import { AxiosRequestConfig } from 'axios'

// Arguments

export type GeneratorsListArguments = WebAPICallOptions &
  ListQueryParams & {
    visible?: boolean
  }

export interface GeneratorsGetArguments extends WebAPICallOptions {
  generatorName: string
}

// Requests
export const generatorsListRequestConfig = (
  args: GeneratorsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)

  return {
    method: 'GET',
    url: 'generators',
    params,
  }
}

export const generatorsGetRequestConfig = (
  args: GeneratorsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `generators/${args.generatorName}`,
  }
}

// Responses

export type GeneratorsListResponse = WebAPICallResult &
  PaginatedResponse<Generator> & {
    error?: string
  }

export type GeneratorsGetResponse = WebAPICallResult & {
  error?: string
  generator?: Generator
}

// Types

export type Generator = {
  _id: string
  generatorName: string
  description: string
  output: string
  defaultVersionId?: string
  deployment?: string
  versions: GeneratorVersion[]
  visible?: boolean
}

export type GeneratorVersion = {
  versionId: string
  parameters: GeneratorParameter[]
}

export type GeneratorParameter = {
  name: string
  label: string
  description?: string
  isRequired?: boolean
  optional?: boolean
  default?: any
  allowedValues?: any[]
  allowedValuesFrom?: string
  minimum?: number
  maximum?: number
  step?: number
  minLength?: number
  maxLength?: number
  mediaUpload?: string
}

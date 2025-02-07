import {
  ListQueryParams,
  WebAPICallOptions,
  WebAPICallResult,
  transformArgsIntoURLParams,
} from '../../types'
import { AxiosRequestConfig } from 'axios'

export type ToolOutputTypeV2 =
  | 'video'
  | 'image'
  | 'model'
  | 'text'
  | 'audio'
  | 'lora'

// Arguments
export type ToolsListArgumentsV2 = WebAPICallOptions &
  ListQueryParams & {
    hideParams?: boolean
  }

export interface ToolsGetArgumentsV2 extends WebAPICallOptions {
  toolKey: string
}

// Requests
export const toolsListRequestConfigV2 = (
  args: ToolsListArgumentsV2,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)

  return {
    method: 'GET',
    url: 'v2/tools',
    params,
  }
}

export const toolsGetRequestConfigV2 = (
  args: ToolsGetArgumentsV2,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/tools/${args.toolKey}`,
  }
}

// Responses

export type ToolsListResponseV2 = WebAPICallResult & {
  tools?: ToolV2[]
  error?: string
}

export type ToolsGetResponseV2 = WebAPICallResult & {
  tool?: ToolV2
  error?: string
}

// Types

export type BaseModelName =
  | 'sdxl'
  | 'sd3'
  | 'sd15'
  | 'flux'
  | 'flux-dev'
  | 'flux_dev'
  | 'JuggernautXL_v6'

export type ToolV2 = {
  key: string
  name: string
  description?: string
  active?: boolean
  parameters?: ToolParameterV2[]
  output_type: ToolOutputTypeV2
  cost_estimate?: string
  resolutions?: string[]
  thumbnail?: string
  order?: number
  base_model?: BaseModelName
}

export type ToolParameterTypeValue =
  | 'video'
  | 'array'
  | 'image'
  | 'model'
  | 'audio'
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'lora'
  | 'archive'

export type ToolParameterSingleType = {
  type: ToolParameterTypeValue
}

export type ToolParameterArrayType = {
  type: 'array'
  items: ToolParameterSingleType | ToolParameterUnionType
}

export type ToolParameterUnionType = {
  anyOf: (ToolParameterSingleType | ToolParameterArrayType)[]
}

export type ToolParameterV2 = {
  name: string
  label: string
  description: string
  tip: string | null
  schema: {
    type?: ToolParameterTypeValue
    items?: ToolParameterSingleType | ToolParameterUnionType
    anyOf?: (ToolParameterSingleType | ToolParameterArrayType)[]
  }
  required: boolean
  default: string | number | null | undefined | boolean
  minimum?: number | null
  maximum?: number | null
  min_length?: number | null
  max_length?: number | null
  step?: number | null
  choices?: Array<string | number> | null
  choices_labels?: Array<string> | null
  hide_from_agent?: boolean
  hide_from_ui?: boolean
  visible_if?: string
}

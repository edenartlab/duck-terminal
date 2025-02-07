import {
  CreationV2,
  CreationsV2PatchResponse,
  FeedV2CursorResponse,
  ModelV2,
  ModelsV2PatchResponse,
  TaskV2,
  TasksV2ListResponse,
} from '@edenlabs/eden-sdk'
import { InfiniteData } from '@tanstack/react-query'

// Type Guard to differentiate between Model and Creation patch responses
export function isModelsV2PatchResponse(
  response: ModelsV2PatchResponse | CreationsV2PatchResponse,
): response is ModelsV2PatchResponse {
  return 'model' in response
}

// Type Guard to check if data is InfiniteData
export function isInfiniteData(
  data: unknown,
): data is InfiniteData<TasksV2ListResponse | FeedV2CursorResponse> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'pages' in data &&
    Array.isArray(
      (data as InfiniteData<TasksV2ListResponse | FeedV2CursorResponse>).pages,
    )
  )
}

// Type Guards for different data types
export function isCreationData(data: unknown): data is CreationV2 {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_id' in data &&
    'public' in data
  )
}

export function isModelData(data: unknown): data is ModelV2 {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_id' in data &&
    'public' in data
  )
}

export function isTaskV2(data: unknown): data is TaskV2 {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_id' in data &&
    'result' in data &&
    Array.isArray((data as TaskV2).result)
  )
}

export function isTasksV2ListResponse(
  data: unknown,
): data is TasksV2ListResponse {
  return (
    (typeof data === 'object' &&
      data !== null &&
      'docs' in data &&
      Array.isArray((data as TasksV2ListResponse).docs) &&
      (data as TasksV2ListResponse)?.docs?.every(doc => isTaskV2(doc))) ||
    false
  )
}

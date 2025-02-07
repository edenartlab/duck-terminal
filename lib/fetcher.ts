import { NotFoundError, ServerError, UnauthorizedError } from '@/lib/errors'
import {
  CursorPaginatedFeedQuery,
  CursorPaginatedRouteQueryParams,
  FeedCursorRouteQueryParams,
  ListQueryParams,
} from '@edenlabs/eden-sdk'
import axios, { AxiosError } from 'axios'

// import * as queryString from 'querystring'

export const fetcher = async <T>(
  ...args: Parameters<typeof fetch>
): Promise<T> => {
  const response = await fetch(...args)

  if (response.ok) return response.json()

  if (response.status === 401) throw new UnauthorizedError(response.statusText)
  if (response.status === 404) throw new NotFoundError(response.statusText)

  throw new ServerError('Network response was not ok')
}

export const handleAxiosServerError = (error: AxiosError | unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data.message ||
      error.response?.data.error ||
      'Unknown Error has occurred'
    )
  }

  return 'Unknown Error has occurred'
}

export const extractPaginationParams = (
  params: URLSearchParams,
): Partial<ListQueryParams> => {
  const query: Partial<ListQueryParams> = {}

  const sort = params.getAll('sort')
  if (sort) query.sort = sort

  const limit = params.get('limit')
  if (limit) query.limit = Number(limit)

  const page = params.get('page')
  if (page) query.page = Number(page)

  return query
}

// type FilterKey =
//   | 'name'
//   | 'creationId'
//   | 'collectionId'
//   | 'characterId'
//   | 'conceptId'
//   | 'maxDate'
//   | 'minDate'
//   | 'generatorId'
//   | 'outputType'
//   | 'isPrivate'
//   | 'visibility'
//   | 'sort'
//   | 'limit'
//   | 'cursor'
//   | 'nextValue'
//   | 'userId';

// type FilterTypeMap = Record<FilterKey, string | string[] | number | boolean | undefined> & {
//   name?: string,
//   creationId?: string,
//   collectionId?: string,
//   characterId?: string,
//   conceptId?: string,
//   maxDate?: string,
//   minDate?: string,
//   generatorId?: string | string[],
//   outputType?: string | string[],
//   isPrivate?: boolean,
//   visibility?: string,
//   sort?: string,
//   limit?: number,
//   cursor?: string,
//   nextValue?: number,
//   userId?: string,
// }
// type FilterParams<T> = { [K in keyof T]: T[K] };

// type CursorPaginatedFeedQuery = FilterParams<FilterTypeMap>;

export const createCursorPaginationRoute = (
  baseUrl: string,
  query: FeedCursorRouteQueryParams['filter'] & CursorPaginatedRouteQueryParams,
) => {
  const basePath = baseUrl
  const params: CursorPaginatedFeedQuery = {}

  if (query.limit) {
    params.limit = query.limit
  }
  if (query.cursor) {
    params.cursor = query.cursor
  }
  if (query.nextValue) {
    params.nextValue = query.nextValue
  }

  const filters = []

  // console.log(query.userId, query.orderBy)

  const userIdExists = !!query.user
  const isOrderByLiked = query.orderBy === 'liked'
  const isOrderByOther = !query.orderBy || !isOrderByLiked

  const likedByUserFilter = { likedBy: query.user }
  const userFilter = { user: String(query.user) }

  if (userIdExists) {
    if (isOrderByLiked) {
      filters.push(likedByUserFilter)
      filters.push({ public: false })
    }

    if (isOrderByOther) {
      filters.push(userFilter)
    }
  }
  if (query.name && query.name.length > 0) {
    filters.push({ name: String(query.name) })
  }
  if (query.owner) {
    filters.push({ owner: String(query.owner) })
  }
  if (query.creation) {
    filters.push({ creation: String(query.creation) })
  }
  if (query.collection) {
    filters.push({ collection: String(query.collection) })
  }
  if (query.character) {
    filters.push({ character: String(query.character) })
  }
  if (query.concept) {
    filters.push({ concept: String(query.concept) })
  }
  if (query.maxDate) {
    filters.push({ maxDate: query.maxDate })
  }
  if (query.minDate) {
    filters.push({ minDate: query.minDate })
  }

  if (query.base_model) {
    if (typeof query.base_model === 'string') {
      filters.push({ base_model: query.base_model })
    } else if (Array.isArray(query.base_model) && query.base_model.length) {
      query.base_model.map(base_model => {
        filters.push({ base_model: base_model })
      })
    }
  }

  if (query.tool) {
    if (typeof query.tool === 'string') {
      filters.push({ tool: query.tool })
    } else if (Array.isArray(query.tool) && query.tool.length) {
      query.tool.map(id => {
        filters.push({ tool: id })
      })
    }
  }

  if (query.output_type) {
    if (typeof query.output_type === 'string') {
      filters.push({ output_type: query.output_type })
    } else if (Array.isArray(query.output_type) && query.output_type.length) {
      query.output_type.map(id => {
        filters.push({ output_type: id })
      })
    }
  }

  if (query._id) {
    if (typeof query._id === 'string') {
      filters.push({ _id: query._id })
    } else if (Array.isArray(query._id) && query._id.length) {
      query._id.map(id => {
        filters.push({ _id: id })
      })
    }
  }

  if (query.visibility && query.visibility !== 'all') {
    filters.push({ public: query.visibility === 'private' })
  } else if (typeof query.isPrivate !== 'undefined') {
    filters.push({ public: !query.isPrivate })
  }

  // if (query.orderBy) {
  //   params.sort = [`${String(query.orderBy)};-1`]
  //   if (query.orderBy !== 'createdAt') {
  //     params.sort.push(`createdAt;-1`)
  //   }
  // if (query.orderBy === OrderByPopularity.field) {
  //   filters.push({ praiseCount: true })
  // }
  // }

  // console.log(query, filters, params)
  if (query.sort) {
    params.sort = query.sort
  }

  let queryStringArray: string[] = []

  for (let key in params) {
    // @ts-ignore
    if (Array.isArray(params[key])) {
      // @ts-ignore
      params[key].forEach((value: string | number) => {
        queryStringArray.push(`${key}=${value}`)
      })
    } else {
      // @ts-ignore
      queryStringArray.push(`${key}=${params[key]}`)
    }
  }

  const filterStringArray = filters.map(filter => {
    const [field, value] = Object.entries(filter)[0]
    return `filter=${field};${value}`
  })
  // console.log(queryStringArray)
  // console.log(filters)
  const queryString = [...queryStringArray, ...filterStringArray].join('&')

  // console.log({ filters, queryString })

  return queryString ? `${basePath}?${queryString}` : basePath
}

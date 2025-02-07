export type CursorPaginationQueryParams = {
  cursor?: string
  nextValue?: number
  limit?: number
  orderBy?: string
}

export type FeedFilterQueryParams = {
  sort?: string | string[]
  filter?: {
    name?: string | string[]
    user?: string | string[]
    character?: string | string[]
    collection?: string | string[]
    creation?: string | string[]
    tool?: string | string[]
    output_type?: string | string[]
    concept?: string | string[]
    public?: boolean
    visibility?: 'all' | 'public' | 'private'
    maxDate?: string
    minDate?: string
  }
}

export type FeedQueryParams = FeedFilterQueryParams &
  CursorPaginationQueryParams

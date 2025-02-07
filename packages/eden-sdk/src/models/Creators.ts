import { transformArgsIntoURLParams } from '../types'
import {
  ListQueryParams,
  PaginatedResponse,
  WebAPICallOptions,
  WebAPICallResult,
} from '../types'
import { Task } from './Tasks'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface CreatorsFollowArguments extends WebAPICallOptions {
  userId: string
}

export interface CreatorsUnfollowArguments extends WebAPICallOptions {
  userId: string
}

export interface CreatorsListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId?: string | string[]
  discordId?: string | string[]
}

export interface CreatorsGetArguments extends WebAPICallOptions {
  userId: string
}

export interface CreatorsUpdateArguments extends WebAPICallOptions {
  username?: string
  userImage?: string
}

export interface CreatorFollowersListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId: string
}

export interface CreatorFollowingListArguments
  extends WebAPICallOptions,
    ListQueryParams {
  userId: string
}

// Requests

export const creatorsFollowRequestConfig = (
  args: CreatorsFollowArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'creators/follow',
    data: {
      ...args,
    },
  }
}

export const creatorsUnfollowRequestConfig = (
  args: CreatorsUnfollowArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'creators/unfollow',
    data: {
      ...args,
    },
  }
}

export const creatorsListRequestConfig = (
  args: CreatorsListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: 'creators',
    params,
  }
}

export const creatorsGetRequestConfig = (
  args: CreatorsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `creators/${args.userId}`,
  }
}

export const creatorsGetV2RequestConfig = (
  args: CreatorsGetArguments,
): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/creators/${args.userId}`,
  }
}

export const creatorsGetMeRequestConfig = (): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `creators/me`,
  }
}

export const creatorsGetMeV2RequestConfig = (): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `v2/creators/me`,
  }
}

export const creatorsUpdateRequestConfig = (
  args: CreatorsUpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'creators/update',
    data: {
      ...args,
    },
  }
}

export const creatorsUpdateV2RequestConfig = (
  args: CreatorsUpdateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'v2/creators/update',
    data: {
      ...args,
    },
  }
}

export const creatorFollowersListRequestConfig = (
  args: CreatorFollowersListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: `creators/${args.userId}/followers`,
    params,
  }
}

export const creatorFollowingListRequestConfig = (
  args: CreatorFollowingListArguments,
): AxiosRequestConfig => {
  const params = transformArgsIntoURLParams(args)
  return {
    method: 'GET',
    url: `creators/${args.userId}/following`,
    params,
  }
}

// Responses

export type CreatorsFollowResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CreatorsUnfollowResponse = WebAPICallResult & {
  error?: string
  success?: boolean
}

export type CreatorsListResponse = WebAPICallResult &
  PaginatedResponse<Creator> & {
    error?: string
  }

export type CreatorFollowersListResponse = WebAPICallResult &
  PaginatedResponse<Creator> & {
    error?: string
  }

export type CreatorFollowingListResponse = WebAPICallResult &
  PaginatedResponse<Creator> & {
    error?: string
  }

export type CreatorsGetResponse = WebAPICallResult & {
  error?: string
  creator?: Creator
}

export type CreatorsUpdateResponse = WebAPICallResult & {
  error?: string
  creator?: Creator
}

export type CreatorsGetMeResponse = WebAPICallResult & {
  error?: string
  creator?: Creator
  balance?: number
  subscriptionBalance?: number
  foreverBalance?: number
  pendingTasks?: Task[]
}

// Types

export type Creator = {
  _id: string
  userId: string
  username?: string
  userImage?: string
  email?: string
  normalizedEmail?: string
  creations?: string[]
  creationsCount?: number
  collections?: string[]
  creationCount?: number
  followerCount?: number
  followingCount?: number
  isFollowing?: boolean
  featureFlags?: FeatureFlag[]
  subscriptionTier?: SubscriptionTier
  stripeCustomerId?: string
  lastDailyLoginBonus?: Date
  discordLinkBonusClaimed?: boolean
  discordId?: string
  createdAt: string
  updatedAt: string
}

export enum SubscriptionTier {
  Free = 0,
  Basic = 1,
  Pro = 2,
  Believer = 3,
  Admin = 4,
}

export enum FeatureFlag {
  Preview = 'preview',
  Eden2EarlyAccess = 'eden2earlyaccess',
  LimitsBasic = 'limits_Basic',
  LimitsPro = 'limits_Pro',
  LimitsBeliever = 'limits_Believer',
  LimitsAdmin = 'limits_Admin',
  AssistantAccess = 'assistant_access',
  FreeTools = 'freeTools',
}

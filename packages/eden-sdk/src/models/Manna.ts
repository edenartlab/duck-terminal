import { WebAPICallOptions, WebAPICallResult } from '../types'
import { AxiosRequestConfig } from 'axios'

// Arguments

export type MannaBalanceGetArguments = WebAPICallOptions

export interface MannaVouchersRedeemArguments extends WebAPICallOptions {
  code: string
}

// Requests

export const mannaBalanceGetRequestConfig = (): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: 'manna/balance',
  }
}

export const mannaVouchersRedeemRequestConfig = (
  args: MannaVouchersRedeemArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'manna/vouchers/redeem',
    data: {
      ...args,
    },
  }
}

// Responses

export type MannaBalanceGetResponse = WebAPICallResult & {
  error?: string
  balance: number
  subscriptionBalance: number
}

export type MannaVoucherRedeemResponse = WebAPICallResult & {
  error?: string
  action?: string
  manna: number
  transactionId: string
}

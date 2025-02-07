import { WebAPICallOptions, WebAPICallResult } from '../types'
import { AxiosRequestConfig } from 'axios'

// Arguments

export interface PaymentsCreateArguments extends WebAPICallOptions {
  priceId: string
  paymentMode: 'payment' | 'subscription'
  analyticsClientId?: string
  returnUrl?: string
}

export interface PaymentsSubscriptionArguments extends WebAPICallOptions {
  stripeCustomerId: string
  returnUrl?: string
}

// Requests

export const paymentsCreateRequestConfig = (
  args: PaymentsCreateArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'payments/create',
    data: {
      ...args,
    },
  }
}

export const paymentsProductsRequestConfig = (): AxiosRequestConfig => {
  return {
    method: 'GET',
    url: 'payments/products',
  }
}

export const paymentsSubscriptionRequestConfig = (
  args: PaymentsSubscriptionArguments,
): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: 'payments/subscription',
    data: {
      ...args,
    },
  }
}

// Responses

export type PaymentsCreateResponse = WebAPICallResult & {
  error?: string
  url?: string
}

export type PaymentsProductsResponse = WebAPICallResult & {
  error?: string
  products?: Product[]
  subscriptions?: Product[]
}

export type PaymentsSubscriptionResponse = WebAPICallResult & {
  error?: string
  url?: string
}

// Types

export type Product = {
  id: string
  object: string
  active: boolean
  created: number
  default_price: string
  description: string
  images: string[]
  livemode: boolean
  metadata: any
  name: string
  package_dimensions: null
  displayPrice: {
    currency: string
    unit_amount: number
    type: string
  }
  shippable: null
  statement_descriptor: null
  tax_code: null
  unit_label: null
  updated: number
  url: null
}

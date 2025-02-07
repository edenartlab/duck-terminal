import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { handleAxiosServerError } from '@/lib/fetcher'
import { EdenClient } from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

const checkout = async (
  authToken: string,
  priceId: string,
  paymentMode: 'subscription' | 'payment',
) => {
  const eden = new EdenClient({
    edenApiUrl: env.NEXT_PUBLIC_EDEN_API_URL,
    token: authToken,
  })

  const response = await eden.payments.create({
    priceId,
    paymentMode,
    returnUrl: env.NEXT_PUBLIC_HOST,
  })

  return NextResponse.json({ url: response.url }, { status: 200 })
}

const manage = async (
  authToken: string,
  stripeCustomerId: string,
  returnUrl?: string,
) => {
  const eden = new EdenClient({
    edenApiUrl: env.NEXT_PUBLIC_EDEN_API_URL,
    token: authToken,
  })

  const response = await eden.payments.subscription({
    stripeCustomerId,
    returnUrl,
  })

  return NextResponse.json({ url: response.url }, { status: 200 })
}

export async function POST(req: NextRequest) {
  const authToken = await getAuthToken(req)


  const { requestType, returnUrl, ...body } = await req.json()

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    switch (requestType) {
      case 'checkout':
        return checkout(authToken, body.priceId, body.paymentMode)
      case 'manage':
        return manage(authToken, body.stripeCustomerId, returnUrl)
    }
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

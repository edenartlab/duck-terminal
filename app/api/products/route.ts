import { handleAxiosServerError } from '@/lib/fetcher'
import { EdenClient } from '@edenlabs/eden-sdk'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
    })

    const res = await eden.payments.products()

    return NextResponse.json({
      products: res.products,
      subscriptions: res.subscriptions,
    })
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import { EdenClient } from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ message: 'Not authenticated' }), {
      status: 401,
    })
  }

  const requestJson = await request.json()

  if (!requestJson || !requestJson.code) {
    return new NextResponse(JSON.stringify({ message: 'Code is missing' }), {
      status: 400,
    })
  }

  const eden = new EdenClient({
    edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
    token: authToken,
  })

  try {
    const response = await eden.manna.vouchers.redeem({
      code: requestJson.code,
    })
    // console.log({ response })
    return NextResponse.json(response)
  } catch (error) {
    // console.log(error)
    const errorMessage = handleAxiosServerError(error)
    // console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

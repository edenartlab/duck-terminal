import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import { EdenClient } from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params: { name } }: { params: { name: string } },
) {
  if (!name) {
    return new NextResponse(JSON.stringify({ message: 'Missing name' }), {
      status: 400,
    })
  }

  const authToken = await getAuthToken(request)

  // console.log('auth()', name, request.url)

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.creators.getV2({ userId: name })

    if (!res) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      })
    }

    return NextResponse.json(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

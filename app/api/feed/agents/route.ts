import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { handleAxiosServerError } from '@/lib/fetcher'
import axios from 'axios'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authToken = await getAuthToken(request)

  try {
    const searchParams = request.nextUrl.searchParams
    const route = `${
      env.NEXT_PUBLIC_EDEN_API_URL
    }/v2/feed-cursor/agents?${searchParams.toString()}`

    const response = await axios.get(route, {
      withCredentials: true,
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : undefined,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

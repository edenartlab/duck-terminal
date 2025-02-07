import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import axios from 'axios'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
 const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const basePath = `${process.env.NEXT_PUBLIC_EDEN_API_URL}/auth/daily-login`
    const response = await axios.post(
      basePath,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

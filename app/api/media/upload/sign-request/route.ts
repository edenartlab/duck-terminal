import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    })
  }

  const requestJson = await request.json()
  const { filename, contentType } = requestJson

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_EDEN_API_URL}/media/upload/request`,
      {
        filename,
        contentType,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    // console.log(error)
    const errorMessage = handleAxiosServerError(error)
    // console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

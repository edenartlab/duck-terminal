import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
 const authToken = await getAuthToken(request)

  try {
    const basePath = `${process.env.NEXT_PUBLIC_EDEN_API_URL}/auth/discord/disconnect`
    const response = await axios.get(basePath, {
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

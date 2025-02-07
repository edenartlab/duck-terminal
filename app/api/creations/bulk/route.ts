import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  CreationsV2BulkPatchArguments,
  CreationsV2BulkPatchResponse,
  EdenClient,
} from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
 const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    })
  }

  const requestJson = await request.json()
  const {
    creationIds,
    public: isPublic,
    deleted,
  } = requestJson as CreationsV2BulkPatchArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.creations.bulkUpdateV2({
      creationIds,
      public: isPublic,
      deleted,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Creations update error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<CreationsV2BulkPatchResponse>(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

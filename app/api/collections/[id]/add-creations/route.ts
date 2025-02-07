import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  CollectionsV2AddCreationsArguments,
  CollectionsV2AddCreationsResponse,
  EdenClient,
} from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id) {
    return new NextResponse(JSON.stringify({ message: 'Missing id' }), {
      status: 400,
    })
  }

 const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    })
  }

  const requestJson = await request.json()
  const { creationIds } = requestJson as CollectionsV2AddCreationsArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.collections.creations.addV2({
      collectionId: id,
      creationIds,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Collection update error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<CollectionsV2AddCreationsResponse>(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

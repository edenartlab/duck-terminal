import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  CollectionsV2CreateArguments,
  CollectionsV2CreateResponse,
  CollectionsV2DeleteResponse,
  EdenClient,
} from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
 const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    })
  }

  const requestJson = await request.json()
  const { name } = requestJson as CollectionsV2CreateArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.collections.createV2({
      name,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Collection create error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<CollectionsV2CreateResponse>(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

export async function DELETE(
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
  // console.log('auth()', id, request.url)

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    await eden.collections.deleteV2({
      collectionId: id,
    })

    return NextResponse.json<CollectionsV2DeleteResponse>({
      success: true,
    })
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

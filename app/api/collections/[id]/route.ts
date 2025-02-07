import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  CollectionsV2DeleteResponse,
  CollectionsV2UpdateArguments,
  CollectionsV2UpdateResponse,
  EdenClient,
} from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id) {
    return new NextResponse(JSON.stringify({ message: 'Missing id' }), {
      status: 400,
    })
  }

 const authToken = await getAuthToken(request)
  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken || undefined,
    })

    const res = await eden.collections.getV2({
      collectionId: id,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Collection not found' }),
        {
          status: 404,
        },
      )
    }

    return NextResponse.json(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

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
  // console.log('auth()', id, request.url)

  const requestJson = await request.json()
  const {
    public: isPublic,
    name,
    description,
  } = requestJson as CollectionsV2UpdateArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.collections.updateV2({
      collectionId: id,
      public: isPublic,
      name,
      description,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Collection update error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<CollectionsV2UpdateResponse>(res)
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

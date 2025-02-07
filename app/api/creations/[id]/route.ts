import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  CreationsV2PatchArguments,
  CreationsV2PatchResponse,
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

  // console.log('auth()', id, request.url, authToken)

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken !== null ? authToken : undefined,
    })

    const res = await eden.creations.getV2({ creationId: id })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Creation not found' }),
        {
          status: 404,
        },
      )
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
  const { public: isPublic, deleted } = requestJson as CreationsV2PatchArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.creations.updateV2({
      creationId: id,
      public: isPublic,
      deleted,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Creation update error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<CreationsV2PatchResponse>(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

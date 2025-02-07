import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  EdenClient,
  ModelsV2PatchArguments,
  ModelsV2PatchResponse,
} from '@edenlabs/eden-sdk'
import { AxiosError } from 'axios'
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

  // console.log('auth()', id, request.url)

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken !== null ? authToken : undefined,
    })

    const res = await eden.models.get({ modelId: id })

    if (!res) {
      return new NextResponse(JSON.stringify({ message: 'Model not found' }), {
        status: 404,
      })
    }

    return NextResponse.json(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: (error as AxiosError).response?.status ?? 500,
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

  // console.log('auth()', id, request.url)

  const requestJson = await request.json()
  const { public: isPublic, deleted } = requestJson as ModelsV2PatchArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken !== null ? authToken : undefined,
    })

    const res = await eden.models.update({
      modelId: id,
      public: isPublic,
      deleted,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Model update error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<ModelsV2PatchResponse>(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

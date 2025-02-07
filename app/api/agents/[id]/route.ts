import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  AgentsDeleteResponse,
  AgentsUpdateArguments,
  AgentsUpdateResponse,
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

    const res = await eden.agents.get({
      agentId: id,
    })

    if (!res) {
      return new NextResponse(JSON.stringify({ message: 'Agent not found' }), {
        status: 404,
      })
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

  const requestJson = await request.json()
  const {
    public: isPublic,
    name,
    key,
    description,
    image,
    instructions,
    tools,
    discordId,
    modelId,
  } = requestJson as AgentsUpdateArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.agents.update({
      agentId: id,
      public: isPublic,
      name,
      key,
      description,
      image,
      instructions,
      tools,
      discordId,
      modelId,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Agent update error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<AgentsUpdateResponse>(res)
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

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    await eden.agents.delete({
      agentId: id,
    })

    return NextResponse.json<AgentsDeleteResponse>({
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

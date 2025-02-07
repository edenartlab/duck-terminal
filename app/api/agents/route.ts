import { getAuthToken } from '@/lib/auth'
import { handleAxiosServerError } from '@/lib/fetcher'
import {
  AgentsCreateArguments,
  AgentsCreateResponse,
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
  const { name, key, description, image, instructions, discordId, modelId } =
    requestJson as AgentsCreateArguments

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const res = await eden.agents.create({
      name,
      key,
      description,
      image,
      instructions,
      discordId,
      modelId,
    })

    if (!res) {
      return new NextResponse(
        JSON.stringify({ message: 'Agent create error' }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json<AgentsCreateResponse>(res)
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

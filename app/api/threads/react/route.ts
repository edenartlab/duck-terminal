import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { EdenClient } from '@edenlabs/eden-sdk'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ message: 'Not authenticated' }), {
      status: 401,
    })
  }

  const requestJson = await request.json()

  if (!requestJson) {
    return new NextResponse(JSON.stringify({ message: 'No data passed' }), {
      status: 400,
    })
  }

  // if (!requestJson.thread_id) {
  //   return new NextResponse(JSON.stringify({ message: 'No thread_id passed' }), {
  //     status: 400,
  //   })
  // }

  if (!requestJson.message_id) {
    return new NextResponse(
      JSON.stringify({ message: 'No message_id passed' }),
      {
        status: 400,
      },
    )
  }

  if (!requestJson.reaction) {
    return new NextResponse(JSON.stringify({ message: 'No reaction passed' }), {
      status: 400,
    })
  }

  try {
    const eden = new EdenClient({
      edenApiUrl: env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const result = await eden.threads.react({
      message_id: requestJson.message_id,
      reaction: requestJson.reaction,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        return new NextResponse(
          JSON.stringify({ message: error.response.data }),
          {
            status: 500,
          },
        )
      }
    }

    return new NextResponse(JSON.stringify({ message: error }), {
      status: 500,
    })
  }
}

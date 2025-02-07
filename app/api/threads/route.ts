import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { EdenClient, ThreadsMessageArguments } from '@edenlabs/eden-sdk'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

async function sendMessage(args: ThreadsMessageArguments, eden: EdenClient) {
  // console.log('route:sendMessage', args)
  //
  // if (!args.thread_id) {
  //   console.log('sendMessage - no thread: should create thread')
  // } else {
  //   console.log('sendMessage: existing thread')
  // }

  return eden.threads
    .message(args)
    .then(response => {
      if (!response || response.message) {
        return new NextResponse(
          JSON.stringify({
            message: response.message || 'Internal Error - unknown reason',
          }),
          {
            status: 500,
          },
        )
      }

      if (response && !response.thread_id) {
        return new NextResponse(
          JSON.stringify({
            message: response.message || `Could not send message`,
          }),
          {
            status: 500,
          },
        )
      }

      return NextResponse.json(response)
    })
    .catch(error => {
      // console.log(error.response.data)
      return new NextResponse(
        JSON.stringify({
          message: error?.response?.data
            ? error.response.data.error
              ? error.response.data.error
              : error.response.data.message
            : error.response.statusText || 'Internal Exception',
          error:
            process.env.NEXT_PUBLIC_APP_ENV === 'production'
              ? '- redacted -'
              : error,
        }),
        {
          status: error.response.status || 500,
        },
      )
    })
}

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

  if (!requestJson.agent_id) {
    return new NextResponse(JSON.stringify({ message: 'No agent_id passed' }), {
      status: 400,
    })
  }

  if (
    !requestJson.content &&
    !(requestJson.attachments && requestJson.attachments.length)
  ) {
    return new NextResponse(
      JSON.stringify({ message: 'Neither content nor attachments passed' }),
      {
        status: 400,
      },
    )
  }

  try {
    const eden = new EdenClient({
      edenApiUrl: env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const messageResponse = await sendMessage(requestJson, eden)
    const messageJson = await messageResponse.json()

    return NextResponse.json({
      thread_id: requestJson.thread_id ?? messageJson.thread_id,
    })
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

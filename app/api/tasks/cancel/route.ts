import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { EdenClient, TaskV2 } from '@edenlabs/eden-sdk'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const cancelTask = async (taskId: TaskV2['_id'], eden: EdenClient) => {
  return eden.tasks
    .cancelV2({
      taskId,
    })
    .then(response => {
      // console.log({ 'cancel response': response })
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

      if (response && !response.taskStatus) {
        return new NextResponse(
          JSON.stringify({
            message:
              response.message ||
              `Could not cancel task - invalid compute response`,
          }),
          {
            status: 500,
          },
        )
      }

      return NextResponse.json({ status: response.taskStatus })
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

  if (!requestJson.taskId) {
    return new NextResponse(JSON.stringify({ message: 'Missing taskId' }), {
      status: 400,
    })
  }

  try {
    const eden = new EdenClient({
      edenApiUrl: env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const response = await cancelTask(requestJson.taskId, eden)
    const responseJson = await response.json()

    if (response.status !== 200) {
      return new NextResponse(
        JSON.stringify({
          message: responseJson.message || 'Error creating task',
        }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json(responseJson)
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

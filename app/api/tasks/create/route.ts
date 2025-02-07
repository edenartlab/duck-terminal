import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { EdenClient, TaskV2 } from '@edenlabs/eden-sdk'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const createTask = async (
  tool: string,
  args: TaskV2['args'],
  eden: EdenClient,
) => {
  return eden.tasks
    .createV2({
      tool,
      args,
    })
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

      if (response && !response.task) {
        return new NextResponse(
          JSON.stringify({
            message:
              response.message ||
              `Could not create task - invalid compute response`,
          }),
          {
            status: 500,
          },
        )
      }

      return NextResponse.json(response.task)
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

  if (!requestJson.tool) {
    return new NextResponse(JSON.stringify({ message: 'Missing tool key' }), {
      status: 400,
    })
  }

  if (!requestJson.args) {
    return new NextResponse(JSON.stringify({ message: 'Missing tool args' }), {
      status: 400,
    })
  }

  try {
    const eden = new EdenClient({
      edenApiUrl: env.NEXT_PUBLIC_EDEN_API_URL,
      token: authToken,
    })

    const createdTaskResponse = await createTask(
      requestJson.tool,
      requestJson.args,
      eden,
    )
    const createdTaskJson = await createdTaskResponse.json()

    if (createdTaskResponse.status !== 200) {
      return new NextResponse(
        JSON.stringify({
          message: createdTaskJson.message || 'Error creating task',
        }),
        {
          status: 500,
        },
      )
    }

    return NextResponse.json(createdTaskJson)
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

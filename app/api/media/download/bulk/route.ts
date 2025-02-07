import { getAuthToken } from '@/lib/auth'
import { env } from '@/lib/config'
import { handleAxiosServerError } from '@/lib/fetcher'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // **1. Authenticate the User**
 const authToken = await getAuthToken(request)

  if (!authToken) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // **2. Parse the Incoming Request Body**
    const requestJson = await request.json()
    const { files } = requestJson

    if (!files || !Array.isArray(files) || files.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid files array.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const fastifyResponse = await fetch(
      `${env.NEXT_PUBLIC_EDEN_API_URL}/media/download/bulk`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`, // Forward the auth token if required
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
      },
    )

    // **4. Handle Fastify Response Errors**
    if (!fastifyResponse.ok) {
      const errorData = await fastifyResponse.json()
      return new NextResponse(JSON.stringify(errorData), {
        status: fastifyResponse.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // **5. Stream the ZIP File Back to the Client**
    // Note: In Node.js 18+ and Next.js, `fetch` returns a `ReadableStream` compatible with `NextResponse`.
    const zipStream = fastifyResponse.body

    // **6. Set Appropriate Headers for ZIP Download**
    const headers = new Headers({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="eden_downloads_${Date.now()}.zip"`,
    })

    // **7. Return the Streaming Response**
    return new NextResponse(zipStream, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error in download handler:', error)
    const errorMessage = handleAxiosServerError(error)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

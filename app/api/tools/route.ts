import { handleAxiosServerError } from '@/lib/fetcher'
import { EdenClient } from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
    })

    const query: { hideParams?: boolean; output_type?: string } = {}

    if (searchParams.has('hideParams')) {
      query.hideParams = searchParams.get('hideParams') === 'true'
    }

    if (searchParams.has('output_type')) {
      query.output_type = searchParams.get('output_type') || ''
    }

    const res = await eden.tools.list(query)

    if (!res || !res.tools) {
      return new NextResponse(JSON.stringify({ message: 'No tools found' }), {
        status: 404,
      })
    }

    return NextResponse.json({ tools: res?.tools })
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

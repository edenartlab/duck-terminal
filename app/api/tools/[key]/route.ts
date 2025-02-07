import { handleAxiosServerError } from '@/lib/fetcher'
import { EdenClient, ToolParameterV2 } from '@edenlabs/eden-sdk'
import { NextRequest, NextResponse } from 'next/server'

function replaceNullWithUndefined(arr: ToolParameterV2[]): ToolParameterV2[] {
  return arr.map(item => {
    const newItem: ToolParameterV2 = { ...item }

    for (const key of Object.keys(newItem) as Array<keyof ToolParameterV2>) {
      if (newItem[key] === null || newItem[key] === 'random') {
        switch (key) {
          case 'default':
          case 'minimum':
          case 'maximum':
          case 'min_length':
          case 'max_length':
            newItem[key] = undefined
            break
          default:
            break
        }
      }
    }

    return newItem
  })
}

function prepareParameters(arr: ToolParameterV2[]): ToolParameterV2[] {
  const filterHidden = arr.filter(
    param => param.hide_from_ui === undefined || !param.hide_from_ui,
  )

  return replaceNullWithUndefined(filterHidden)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } },
) {
  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.NEXT_PUBLIC_EDEN_API_URL,
    })

    const res = await eden.tools.get({ toolKey: params.key })

    const transformedParameters = res.tool?.parameters
      ? prepareParameters(res.tool?.parameters)
      : []

    return NextResponse.json({
      tool: { ...res.tool, parameters: transformedParameters },
    })
  } catch (error) {
    const errorMessage = handleAxiosServerError(error)
    console.error(errorMessage)
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
    })
  }
}

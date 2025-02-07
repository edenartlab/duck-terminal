'use server'

import { fetcher } from '@/lib/fetcher'
import { AgentGetResponse } from '@edenlabs/eden-sdk'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const getAgent = async (
  id: string,
): Promise<AgentGetResponse | undefined> => {
  try {
    const response = await fetcher<AgentGetResponse>(
      `${process.env.NEXT_PUBLIC_HOST}/api/agents/${id}`,
      {
        credentials: 'include',
        headers: { Cookie: cookies().toString() },
      },
    )

    return response
  } catch (e) {
    console.error('Error fetching agent:', e)
    return undefined
  }
}

export const getAgentCached = cache(getAgent)

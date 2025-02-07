import LoadingIndicator from '@/components/loading-indicator'
import ProfileHeader from '@/features/profile/profile-header'
import ProfileTabs from '@/features/profile/profile-tabs'
import { fetcher } from '@/lib/fetcher'
import { CreatorsGetResponse } from '@edenlabs/eden-sdk'
import { Metadata, ResolvingMetadata } from 'next'
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense, cache } from 'react'

type Props = {
  params: {
    name: string
  }
}

const getUser = async (name: string) => {
  try {
    const response = await fetcher<CreatorsGetResponse>(
      `${process.env.NEXT_PUBLIC_HOST}/api/users/${name}`,
      {
        credentials: 'include',
        headers: { Cookie: cookies().toString() },
      },
    )
    return response
  } catch (e) {
    return
  }
}

const getUserCached = cache(getUser)

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const name = params.name

  // fetch data
  const creatorResponse = await getUserCached(name || '')

  if (!creatorResponse) {
    return {}
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousOg: OpenGraph | {} = (await parent).openGraph || {}

  const title = `${creatorResponse.creator?.username} | Eden Create`
  const description = ``

  return {
    // ...(await parent),
    title,
    description,
    openGraph: {
      ...previousOg,
      title,
      description,
      images: creatorResponse.creator?.userImage
        ? [creatorResponse.creator?.userImage]
        : undefined,
    },
  }
}

const CreatorProfilePage = async ({ params: { name } }: Props) => {
  if (!name) {
    return notFound()
  }

  const creatorResponse = await getUserCached(name || '')

  if (!creatorResponse || !creatorResponse.creator) {
    return notFound()
  }

  if (creatorResponse.error) {
    return <div>error response: {String(creatorResponse.error)}</div>
  }

  return (
    <>
      <ProfileHeader name={name} creatorSSRData={creatorResponse.creator} />
      <Suspense fallback={<LoadingIndicator />}>
        <ProfileTabs />
      </Suspense>
    </>
  )
}

export default CreatorProfilePage

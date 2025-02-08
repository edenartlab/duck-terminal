import CardFooter from '@/components/card/components/card-footer'
import CardHeader from '@/components/card/components/card-header'
import CardImage from '@/components/card/components/card-image'
import { Card } from '@/components/ui/card'
import { Creator } from '@edenlabs/eden-sdk'
import Link from 'next/link'

type Props = {
  creator: Creator
  linkHref: string
}
const ArtistCard = ({ creator }: Props) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader title={creator.username} />
      <Link
        href={`/creators/${creator.username}`}
        prefetch={false}
        className="relative w-full block"
      >
        <CardImage
          media={{
            url: creator.userImage,
            thumbnail: creator.userImage,
            width: 512,
            height: 512,
            type: 'image',
          }}
        />
      </Link>
      <CardFooter />
    </Card>
  )
}

export default ArtistCard

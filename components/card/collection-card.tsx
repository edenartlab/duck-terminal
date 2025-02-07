import CollectionActionsMenu from '@/components/button/collection-actions-menu'
import CardFooter from '@/components/card/components/card-footer'
import CardImage from '@/components/card/components/card-image'
import PrivateIcon from '@/components/icons/private-icon'
import { Card } from '@/components/ui/card'
import { CollectionV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { SquareMousePointerIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  collection: CollectionV2
  queryKey: QueryKey
  onClick?: (item: CollectionV2) => void
}

const CollectionCard = ({ collection, queryKey, onClick }: Props) => {
  return (
    <Card className="relative overflow-hidden border-0 z-10 transition-shadow group">
      {collection.creations ? (
        <div className="absolute left-2 text-white top-2 bg-gray-700 bg-opacity-80 rounded-md p-1 z-20 text-xs">
          {collection.creations.length}
        </div>
      ) : null}
      {!collection.public ? <PrivateIcon /> : null}
      {onClick ? (
        <div
          className="absolute inset-0 flex items-center justify-center w-full h-full cursor-pointer hover:ring-2 ring-offset-1 ring-primary-foreground z-50 opacity-0 bg-popover group-hover:opacity-50 [@media(pointer:coarse)]:opacity-50 transition-all"
          onClick={() => onClick(collection)}
        >
          <SquareMousePointerIcon className="mr-2 h-4 w-4" />
          Select
        </div>
      ) : null}
      <Link
        href={`/collections/${collection._id}`}
        prefetch={false}
        className="relative w-full block aspect-square"
      >
        <CardImage
          media={{
            url: collection.coverCreation?.thumbnail,
            thumbnail: collection.coverCreation?.thumbnail,
            width: 512,
            height: 512,
            type: 'image',
          }}
          className="object-cover"
        />
      </Link>
      <CardFooter
        actions={[
          <CollectionActionsMenu
            key={1}
            collection={collection}
            queryKey={queryKey}
          />,
        ]}
      >
        <div className="text-xs truncate mr-2">{collection.name}</div>
      </CardFooter>
    </Card>
  )
}

export default CollectionCard

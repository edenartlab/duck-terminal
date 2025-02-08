import ModelActionsMenu from '@/components/button/model-actions-menu'
import CardFooter from '@/components/card/components/card-footer'
import CardImage from '@/components/card/components/card-image'
import PrivateIcon from '@/components/icons/private-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Creator, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { PlayIcon, SquareMousePointerIcon } from 'lucide-react'
import Link from 'next/link'
import React, { CSSProperties } from 'react'

type Props = {
  model: ModelV2
  linkHref: string
  creator?: Creator
  showFooterItems?: {
    name: boolean
    actions: boolean
  }
  style?: CSSProperties
  queryKey: QueryKey
  onClick?: (item: ModelV2) => void
}

const ModelCard = ({
  model,
  showFooterItems = { name: true, actions: true },
  style,
  queryKey,
  onClick,
}: Props) => {
  const hideFooter = !showFooterItems.name && !showFooterItems.actions

  return (
    <Card className="relative overflow-hidden z-10" style={style}>
      {!model.public ? <PrivateIcon /> : null}
      {onClick ? (
        <div
          className="absolute inset-0 flex items-center justify-center w-full h-full cursor-pointer hover:ring-2 ring-offset-1 ring-primary-foreground z-50 opacity-0 bg-popover hover:opacity-50 [@media(pointer:coarse)]:opacity-50 transition-all"
          onClick={() => onClick(model)}
        >
          <SquareMousePointerIcon className="mr-2 h-4 w-4" />
          Select
        </div>
      ) : null}
      <Link
        href={`/models/${model._id}`}
        prefetch={false}
        className="relative w-full block p-4 border-b-0 bg-accent"
      >
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <Badge variant="secondary" className="text-xs bg-opacity-80">
            {model.base_model}
          </Badge>
        </div>
        <CardImage
          className="rounded-md"
          media={{
            url: model.thumbnail,
            thumbnail: model.thumbnail,
            width: 256,
            height: 256,
            type: 'image',
          }}
        />
      </Link>
      {!hideFooter && (
        <CardFooter
          // creator={creator}
          actions={
            showFooterItems.actions
              ? [
                  // <LikeButton
                  //   key={0}
                  //   count={4}
                  //   isActive={false}
                  //   onChange={() => null}
                  // />,
                  <Link
                    key={2}
                    className="cursor-pointer"
                    href={`/create/image/${
                      model.base_model && model.base_model === 'flux-dev'
                        ? 'flux_dev'
                        : 'txt2img'
                    }?lora=${model._id}`}
                  >
                    <Button
                      className="w-9 h-9 p-2"
                      size="icon"
                      variant="outline"
                      type="button"
                    >
                      <PlayIcon className="h-4 w-4" />
                    </Button>
                  </Link>,
                  <ModelActionsMenu
                    key={1}
                    queryKey={queryKey}
                    model={model}
                  />,
                ]
              : []
          }
        >
          {showFooterItems.name && (
            <div className="text-xs truncate">{model.name}</div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default ModelCard

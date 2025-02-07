import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
  image?: string
  name?: string
  className?: string
}
const UserAvatar = ({ image, name, className }: Props) => {
  return (
    <Avatar
      className={cn(
        'group-hover:brightness-105 transition-all flex items-center',
      )}
    >
      {image ? (
        <Image
          src={image}
          alt="logo"
          width={64}
          height={64}
          className={cn(['group-hover:brightness-105', className])}
        />
      ) : (
        <Skeleton className="absolute inset-0 w-full h-full rounded-full overflow-hidden" />
      )}

      {!image && name ? (
        <AvatarFallback
          delayMs={1250}
          className="font-bold text-sm text-muted-foreground"
        >
          {`${name[0]}${name.slice(-1)}`}
        </AvatarFallback>
      ) : null}
    </Avatar>
  )
}

export default UserAvatar

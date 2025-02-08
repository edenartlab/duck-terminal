import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
  className?: string
}
const EdenLogoTall = ({ className }: Props) => {
  return (
    <div
      className={cn([
        'relative flex flex-grow items-center invert dark:invert-0',
        className,
      ])}
    >
      <Image
        src={'/eden-logo-text-tall-mono.png'}
        alt={'Logo'}
        width={640}
        height={765}
        // fill={true}
        className="h-[192px] md:h-[300px] w-auto"
      />
    </div>
  )
}

export default EdenLogoTall

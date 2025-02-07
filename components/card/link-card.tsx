import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

const LinkCard = ({
  href,
  title,
  text,
}: {
  href: string
  title: string
  text: string
}) => {
  return (
    <Link href={href} className="group rounded-lg">
      <Card className="h-full transition-colors bg-accent/50 group-hover:bg-muted !shadow-none !drop-shadow-none group-hover:border-input group-hover:!shadow-sm">
        <CardHeader className="p-4">
          <div className="flex gap-1 items-center">
            <h2 className={`text-lg md:text-xl font-semibold`}>{title} </h2>
            <ChevronRightIcon className="group-hover:translate-x-1 motion-reduce:transform-none duration-200" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div>
            <p
              className={`m-0 max-w-[30ch] text-sm opacity-50 group-hover:opacity-60`}
            >
              {text}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default LinkCard

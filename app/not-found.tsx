import EdenLogoBw from '@/components/logo/eden-logo-bw'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Custom404() {
  return (
    <section className="block">
      <div className="px-5 md:px-10">
        <div className="py-16 md:py-24 lg:py-32">
          <div className="mx-auto flex-col flex w-full max-w-3xl items-center">
            <EdenLogoBw />
            <div className="text-center mt-4">
              <h2 className="font-bold mb-4 text-2xl md:text-4xl">
                Page not found
              </h2>
              <div className="mx-auto max-w-[528px] mb-5 md:mb-6 lg:mb-8">
                <p className="text-[#636262] max-[479px]:text-sm">
                  Oops! 🌿 Looks like you&apos;re an adventurous spirit. You&apos;ve
                  wandered off the path and ended up in the Forbidden Orchard 🍎
                </p>
              </div>
              <Link href="/" passHref>
                <Button className="font-mono">Back Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

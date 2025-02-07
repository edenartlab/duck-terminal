'use client'

// Error components must be Client Components
import EdenLogoBw from '@/components/logo/eden-logo-bw'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <section className="block">
      <div className="px-5 md:px-10">
        <div className="py-16 md:py-24 lg:py-32">
          <div className="mx-auto flex-col flex w-full max-w-3xl items-center">
            <EdenLogoBw />
            <div className="text-center mt-4">
              <h2 className="font-bold mb-4 text-2xl md:text-4xl">Error</h2>
              <div className="mx-auto max-w-[528px] mb-5 md:mb-6 lg:mb-8">
                <p className="text-[#636262] max-[479px]:text-sm">
                  Oops! 🌿 Looks like our server's gone rogue. You've stumbled
                  into the Orchard of Technical Difficulties 🍎.
                  <br />
                  Don't worry, though; even in the wilds of server issues, your
                  adventurous spirit shines bright.
                  <br />
                  <br />
                  We're working tirelessly to restore the garden to its pristine
                  state.
                </p>
              </div>
              <div className="mt-4 font-mono line-clamp-2">
                {error && error.name ? error.name : ''} -{' '}
                {error && error.message ? error.message : ''}
              </div>
              <Link href="/" passHref>
                <Button className="font-mono">Back Home</Button>
              </Link>
              <Button
                onClick={
                  // Attempt to recover by trying to re-render the segment
                  () => reset()
                }
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

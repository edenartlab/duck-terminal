import '@/styles/globals.scss'
import 'photoswipe/dist/photoswipe.css'

import Providers from '@/app/providers'
import CollectionSelectionDialog from '@/components/dialog/collection-selection-dialog'
import DeleteConfirmationDialog from '@/components/dialog/delete-confirmation-dialog'
import QuickAnimateDialog from '@/components/dialog/quick-animate-dialog'
import QuickUpscaleDialog from '@/components/dialog/quick-upscale-dialog'
import ShareDialog from '@/components/dialog/share-dialog'
import Header from '@/components/header/header'
import { PreloadResources } from '@/components/preload-resources'
import ScrollTopButton from '@/components/scroll-top-button'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { env } from '@/lib/config'
import { cn } from '@/lib/utils'
import { GoogleTagManager } from '@next/third-parties/google'
import HolyLoader from 'holy-loader'
import { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode, StrictMode } from 'react'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
  // width: 'device-width',
  // initialScale: 1.0,
  // viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_HOST),
  title: 'Duck Termianl',
  applicationName: 'Duck Terminal',
  description: 'The Duck Terminal of Artificial Delights',
  openGraph: {
    title: 'Duck Terminal',
    siteName: 'Duck Terminal',
    description: 'The Duck Terminal of Artificial Delights',
    type: 'website',
    images: ['/logo_badge_square.png'],
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
    },
    {
      url: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
}

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <StrictMode>
      <html lang="en" suppressHydrationWarning>
        <PreloadResources />
        <body
          className={cn(
            'min-h-screen bg-background antialiased',
            fontSans.className,
          )}
        >
          <HolyLoader
            color="#9333ea"
            height="1px"
            // ignoreSearchParams={true}
          />
          <Providers>
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              {modal}
              {children}
              <ScrollTopButton />
            </div>

            {env.NEXT_PUBLIC_APP_ENV === 'production' ? (
              <GoogleTagManager gtmId={env.NEXT_PUBLIC_GOOGLE_GTM_ID || ''} />
            ) : (
              <TailwindIndicator />
            )}

            <div id="modal-root" />
            <Toaster expand={false} visibleToasts={9} closeButton={true} />
            <ShareDialog />
            <CollectionSelectionDialog />
            <QuickAnimateDialog />
            <QuickUpscaleDialog />
            <DeleteConfirmationDialog />
          </Providers>
        </body>
      </html>
    </StrictMode>
  )
}

import { SiteConfig } from '@/types/SiteConfig'
import * as process from 'process'

export const env = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'staging',
  NEXT_PUBLIC_DEV_TYPE: process.env.NEXT_PUBLIC_DEV_TYPE || 'eden',
  NEXT_PUBLIC_EDEN_API_URL:
    process.env.NEXT_PUBLIC_EDEN_API_URL || 'http://0.0.0.0:5050',
  NEXT_PUBLIC_EDEN_COMPUTE_SOCKET_URL:
    process.env.NEXT_PUBLIC_EDEN_COMPUTE_SOCKET_URL || '',
  NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000',
  NEXT_PUBLIC_DISCORD_CLIENT_ID:
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '',
  NEXT_PUBLIC_GOOGLE_GTM_ID: process.env.NEXT_PUBLIC_GOOGLE_GTM_ID || '',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID || '',
  NEXT_PUBLIC_AWS_CLOUDFRONT_URL:
    process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL || '',
  NEXT_PUBLIC_EDEN_FEATURED_COLLECTION_ID:
    process.env.NEXT_PUBLIC_EDEN_FEATURED_COLLECTION_ID || '',

  // serverRuntimeConfig
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  EDEN_ADMIN_API_KEY: process.env.EDEN_ADMIN_API_KEY || '',
  EDEN_ADMIN_API_SECRET: process.env.EDEN_ADMIN_API_SECRET || '',
  EDEN_MAINTENANCE_MODE: process.env.EDEN_MAINTENANCE_MODE || false,
}

export const siteConfig: SiteConfig = {
  name: 'Eden Create',
  author: 'edenlabs',
  description: 'Garden of Artificial Delights',
  keywords: [
    'sdxl',
    'flux',
    'artist',
    'community',
    'stablediffusion',
    'generative art',
    'digital art',
  ],
  url: {
    base: env.NEXT_PUBLIC_HOST,
    author: 'EdenLabs',
  },
  links: {
    homepage: 'https://eden.art',
    instagram: 'https://instagram.com/edenartlab',
    twitter: 'https://x.com/eden_art_',
    linkedIn: 'https://www.linkedin.com/company/eden-labs-inc/',
    github: 'https://github.com/edenartlabs/eden',
    discord: 'https://discord.com/invite/4dSYwDT',
  },
  ogImage: `${env.NEXT_PUBLIC_HOST}/logo_badge_square.png`,
  mediaErrorUrl:
    'https://d14i3advvh2bvd.cloudfront.net/7c31e443f964e9d0e99c2fd45bf0b042999045e224aa7e38cb91049dc8340c93.jpeg',
  publicRoutes: [
    '/',
    '/home',
    '/chat',
    '/create',
    '/train',
    '/explore',
    '/sign-in',
    '/sign-up',
    '/concierge',
    '/(api|trpc)',
    '/creators',
    '/creations',
    '/models',
  ],
  featured: {
    tools: ['flux_schnell', 'flux_dev', 'texture_flow', 'animate_3D'],
    agents:
      process.env.NEXT_PUBLIC_APP_ENV === 'production'
        ? [
            '657aa5cd35eb16a8136493e5', // eve
            '657926f90a0f725740a93b77', // abraham
            '6556e52b78c870d99c459052', // verdelis
            '657aa5b70a0f725740bf7c10', // banny
          ]
        : [
            '675fd3af79e00297cdac1324', // eve
            '675f87f379e00297cd9b4396', // oppenheimer
            '675f880079e00297cd9b45d9', // Eden444
          ],
  },
}

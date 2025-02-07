import { SubscriptionTier } from '@edenlabs/eden-sdk'

export const sanitize = (text: string) => {
  return text.replace(/[^a-z0-9_\-\s]/gi, '_')
}

export const formatDuration = (duration: number) => {
  // convert number to x:xx format
  const minutes = Math.floor(duration / 60)
  const seconds = Math.ceil(duration % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const subscriptionTierNameMap: Record<SubscriptionTier, string> = {
  [SubscriptionTier.Free]: 'Free',
  [SubscriptionTier.Basic]: 'Basic',
  [SubscriptionTier.Pro]: 'Pro',
  [SubscriptionTier.Believer]: 'Believer',
  [SubscriptionTier.Admin]: 'Admin',
}

// Helper function to capitalize the first letter
export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}

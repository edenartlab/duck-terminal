export interface OpenGraphVideo {
  url: string
  type: string
  width?: number
  height?: number
  secureUrl?: string
}

export interface OpenGraph {
  type?: string
  title?: string
  description?: string
  images?: string[]
  videos?: OpenGraphVideo[]
}

export interface TwitterMetadata {
  card?: 'summary' | 'summary_large_image' | 'player'
  title?: string
  description?: string
  images?: string[]
  player?: string
  playerWidth?: number
  playerHeight?: number
  // Add other Twitter Card properties as needed
}

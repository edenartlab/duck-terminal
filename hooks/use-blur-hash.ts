import { decodeBlurHash } from '@/lib/fast-blurhash'
import { calculateMaxDimensions } from '@/lib/media'
import { createCanvas } from 'canvas'
import { useEffect, useState } from 'react'

export function useBlurDataUrl(
  blurHash?: string,
  width?: number,
  height?: number,
) {
  // console.log(blurHash, width, height)
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    if (!blurHash) return

    const { width: blurWidth, height: blurHeight } = calculateMaxDimensions(
      (width || 1024) / (height || 1024),
      32,
    )
    const pixels = decodeBlurHash(blurHash, blurWidth, blurHeight)

    if (!pixels) return

    const canvas = createCanvas(blurWidth, blurHeight)
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const imageData = new ImageData(pixels, blurWidth, blurHeight)

    if (!imageData) return

    ctx?.putImageData(imageData, 0, 0)
    const url = canvas.toDataURL()

    setDataUrl(url)
  }, [blurHash, width, height])

  return dataUrl
}

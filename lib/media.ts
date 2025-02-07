export function getCloudfrontUrl(filename?: string, size: number = 2560) {
  if (!filename || !process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL) {
    return ''
  }

  if (filename.startsWith(process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL)) {
    // if filename is a video or ends with _ followed by any number and then . and any extension, do nothing
    if (filename.endsWith('.mp4') || filename.match(/_\d+\.\w+$/)) {
      return filename
    }

    // otherwise, add the string _2560 before the . and extension and ensure that the extension is webp
    return filename.replace(/\.\w+$/, `_${size}.webp`)
  }

  // any other full url should be returned as is (maybe legacy or whatever)
  if (filename.startsWith('https://')) {
    return filename
  }

  return `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${filename}`
}

export function getCloudfrontOriginalUrl(filename?: string) {
  if (!filename || !process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL) {
    return ''
  }

  if (filename.startsWith(process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL)) {
    // if filename is a video or ends with _ followed by any number and then . and any extension, do nothing
    if (filename.endsWith('.mp4') || filename.match(/_\d+\.\w+$/)) {
      return filename
    }
  }

  const s3Prefix = `edenartlab-`
  if (filename.startsWith(`https://${s3Prefix}`)) {
    // remove potentially existing url prefix, only keep pathname of filename - can be any url
    const pathname = filename.replace(/^https?:\/\/[^/]+\//, '')
    return `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${pathname}`
  }

  // any other full url should be returned as is (maybe legacy or whatever)
  if (filename.startsWith('https://')) {
    return filename
  }

  return `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${filename}`
}

export const calculateMaxDimensions = (
  aspectRatio: number,
  maxDimension: number,
): {
  width: number
  height: number
} => {
  let width, height
  if (aspectRatio > 1) {
    width = maxDimension
    height = Math.round(maxDimension / aspectRatio)
  } else {
    width = Math.round(maxDimension * aspectRatio)
    height = maxDimension
  }
  return { width, height }
}

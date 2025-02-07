const digitLookup: Uint8Array = new Uint8Array(128)
const chars =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~'

for (let i = 0; i < 83; i++) {
  digitLookup[chars.charCodeAt(i)] = i
}

const decode83 = (str: string, start: number, end: number): number => {
  let value = 0
  while (start < end) {
    const charCode = str.charCodeAt(start)
    start += 1
    value *= 83
    value += digitLookup[charCode] ?? 0
  }
  return value
}

const pow = Math.pow
const PI = Math.PI
const PI2 = PI * 2

const d = 3294.6
const e = 269.025

const sRGBToLinear = (value: number): number =>
  value > 10.31475 ? pow(value / e + 0.052132, 2.4) : value / d

const linearTosRGB = (v: number): number =>
  Math.max(
    0,
    Math.min(
      255,
      ~~(v > 0.00001227 ? e * pow(v, 0.416666) - 13.025 : v * d + 1),
    ),
  )

const signSqr = (x: number): number => (x < 0 ? -1 : 1) * x * x

/**
 * Fast approximate cosine implementation
 * Based on FTrig https://github.com/netcell/FTrig
 */
const fastCos = (x: number): number => {
  x += PI / 2
  while (x > PI) {
    x -= PI2
  }
  const cos = 1.27323954 * x - 0.405284735 * signSqr(x)
  return 0.225 * (signSqr(cos) - cos) + cos
}

/**
 * Extracts average color from BlurHash image
 * @param blurHash BlurHash image string
 * @returns RGB tuple
 */
export function getBlurHashAverageColor(
  blurHash: string,
): [number, number, number] {
  const val = decode83(blurHash, 2, 6)
  return [val >> 16, (val >> 8) & 255, val & 255]
}

/**
 * Decodes BlurHash image
 * @param blurHash BlurHash image string
 * @param width Output image width
 * @param height Output image height
 * @param punch Optional punch value
 * @returns Uint8ClampedArray containing pixel data
 */
export function decodeBlurHash(
  blurHash: string,
  width: number,
  height: number,
  punch: number = 1,
): Uint8ClampedArray {
  const sizeFlag = decode83(blurHash, 0, 1)
  const numX = (sizeFlag % 9) + 1
  const numY = Math.floor(sizeFlag / 9) + 1
  const size = numX * numY

  const maximumValue = ((decode83(blurHash, 1, 2) + 1) / 13446) * punch

  const colors: Float64Array = new Float64Array(size * 3)

  const averageColor = getBlurHashAverageColor(blurHash)
  for (let i = 0; i < 3; i++) {
    colors[i] = sRGBToLinear(averageColor[i])
  }

  for (let i = 1; i < size; i++) {
    const value = decode83(blurHash, 4 + i * 2, 6 + i * 2)
    colors[i * 3] = signSqr(Math.floor(value / 361) - 9) * maximumValue
    colors[i * 3 + 1] =
      signSqr((Math.floor(value / 19) % 19) - 9) * maximumValue
    colors[i * 3 + 2] = signSqr((value % 19) - 9) * maximumValue
  }

  const cosinesY: Float64Array = new Float64Array(numY * height)
  const cosinesX: Float64Array = new Float64Array(numX * width)
  for (let j = 0; j < numY; j++) {
    for (let y = 0; y < height; y++) {
      cosinesY[j * height + y] = fastCos((PI * y * j) / height)
    }
  }
  for (let i = 0; i < numX; i++) {
    for (let x = 0; x < width; x++) {
      cosinesX[i * width + x] = fastCos((PI * x * i) / width)
    }
  }

  const bytesPerRow = width * 4
  const pixels: Uint8ClampedArray = new Uint8ClampedArray(bytesPerRow * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0
      for (let j = 0; j < numY; j++) {
        const basisY = cosinesY[j * height + y]
        for (let i = 0; i < numX; i++) {
          const basis = cosinesX[i * width + x] * basisY
          const colorIndex = (i + j * numX) * 3
          r += colors[colorIndex] * basis
          g += colors[colorIndex + 1] * basis
          b += colors[colorIndex + 2] * basis
        }
      }

      const pixelIndex = 4 * x + y * bytesPerRow
      pixels[pixelIndex] = linearTosRGB(r)
      pixels[pixelIndex + 1] = linearTosRGB(g)
      pixels[pixelIndex + 2] = linearTosRGB(b)
      pixels[pixelIndex + 3] = 255 // alpha
    }
  }
  return pixels
}

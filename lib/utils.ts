import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// class merging method using twMerge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Long = { low: number; high: number; unsigned: boolean }
export function toBigInt(longObj: Long): bigint {
  const MAX_UINT32 = BigInt('4294967296') // Now using a string
  const highPart = BigInt(longObj.high) * MAX_UINT32
  const lowPart = BigInt(longObj.low)
  return highPart + lowPart
}

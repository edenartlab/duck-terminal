import { EdenMessage } from '@/features/chat/eden-message-converter'

export function createAsyncIterableFromEmitter(
  emitter: MessageEmitter,
  {
    timeout,
    signal,
  }: {
    timeout: number
    signal?: AbortSignal
  },
): AsyncIterable<EdenMessage> {
  return {
    [Symbol.asyncIterator]() {
      let messageQueue: EdenMessage[] = []
      let resolveNext: ((value: IteratorResult<EdenMessage>) => void) | null =
        null
      let done = false

      const onMessage = (message: EdenMessage) => {
        if (done) return
        if (resolveNext) {
          resolveNext({ value: message, done: false })
          resolveNext = null
        } else {
          messageQueue.push(message)
        }
      }

      emitter.on(onMessage)

      // Clean up function
      const cleanup = () => {
        done = true
        emitter.off(onMessage)
        clearTimeout(timeoutId) // <--- make sure you clear the timeout here!
        if (resolveNext) {
          resolveNext({ value: undefined, done: true })
          resolveNext = null
        }
      }

      // Set a timeout to end iteration automatically
      const timeoutId = setTimeout(() => {
        cleanup()
      }, timeout)

      // Check for an AbortSignal
      if (signal) {
        if (signal.aborted) {
          // If the signal is already aborted
          cleanup()
        } else {
          signal.addEventListener('abort', () => {
            cleanup()
          })
        }
      }

      const iterator = {
        async next(): Promise<IteratorResult<EdenMessage>> {
          if (done) {
            return { value: undefined, done: true }
          }
          if (messageQueue.length > 0) {
            return { value: messageQueue.shift()!, done: false }
          }
          return new Promise<IteratorResult<EdenMessage>>(resolve => {
            resolveNext = resolve
          })
        },
        async return(): Promise<IteratorResult<EdenMessage>> {
          cleanup()
          return { value: undefined, done: true }
        },
        async throw(error: Error): Promise<IteratorResult<EdenMessage>> {
          cleanup()
          return Promise.reject(error)
        },
        [Symbol.asyncIterator]() {
          return this
        },
      }

      return iterator
    },
  }
}

export class MessageEmitter {
  private listeners: ((message: EdenMessage) => void)[] = []

  emit(message: EdenMessage) {
    this.listeners.forEach(listener => listener(message))
  }

  on(listener: (message: EdenMessage) => void) {
    this.listeners.push(listener)
    return () => {
      this.off(listener)
    }
  }

  off(listener: (message: EdenMessage) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }
}

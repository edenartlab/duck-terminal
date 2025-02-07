import {
  MessageEmitter,
  createAsyncIterableFromEmitter,
} from './MessageEmitter'
import { EdenMessage } from '@/features/chat/eden-message-converter'
import { describe, expect, it, jest } from '@jest/globals'

jest.useFakeTimers()

const baseUserMessage: Partial<EdenMessage> = { role: 'user', id: '1' }
// const baseToolCallMessage: Partial<EdenMessage> = { status: {type: 'incomplete', reason: 'tool-calls' }, content: 'Test message', role: 'assistant', id: '2' }
const baseAssistantMessage: Partial<EdenMessage> = {
  status: { type: 'complete', reason: 'stop' },
  content: 'Test message',
  role: 'assistant',
  id: '3',
}

describe('MessageEmitter', () => {
  it('should add and remove listeners correctly', () => {
    const emitter = new MessageEmitter()
    const listener = jest.fn()

    const unsubscribe = emitter.on(listener)
    emitter.emit({
      ...baseUserMessage,
      content: 'Test message',
      id: '1',
    } as EdenMessage)
    expect(listener).toHaveBeenCalledWith({
      ...baseUserMessage,
      id: '1',
      content: 'Test message',
    })

    emitter.emit({
      ...baseUserMessage,
      id: '2',
      content: 'Another message',
    } as EdenMessage)
    expect(listener).toHaveBeenCalledWith({
      ...baseUserMessage,
      id: '2',
      content: 'Another message',
    })

    unsubscribe()
    listener.mockClear()

    emitter.emit({
      ...baseUserMessage,
      id: '3',
      content: 'Another message - unhandled es we unsubbed the listener',
    } as EdenMessage)
    expect(listener).not.toHaveBeenCalled()
  })
})

describe('createAsyncIterableFromEmitter', () => {
  it('should yield messages as they are emitted', async () => {
    const emitter = new MessageEmitter()
    const iterable = createAsyncIterableFromEmitter(emitter, 500)
    const messages = [
      { ...baseAssistantMessage, id: '1', content: 'First' },
      { ...baseAssistantMessage, id: '2', content: 'Second' },
    ]

    const iterator = iterable[Symbol.asyncIterator]()
    const nextPromise = iterator.next()

    emitter.emit(messages[0] as EdenMessage)

    const result = await nextPromise
    expect(result).toEqual({ value: messages[0], done: false })

    const nextPromise2 = iterator.next()
    emitter.emit(messages[1] as EdenMessage)

    const result2 = await nextPromise2
    expect(result2).toEqual({ value: messages[1], done: false })
  })

  it('should handle timeout', async () => {
    const emitter = new MessageEmitter()
    const iterable = createAsyncIterableFromEmitter(emitter, 500)
    const iterator = iterable[Symbol.asyncIterator]()

    const nextPromise = iterator.next()

    jest.advanceTimersByTime(5000)

    const result = await nextPromise
    expect(result).toEqual({ value: undefined, done: true })
  })
})

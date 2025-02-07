import { describe, expect, test } from 'vitest'

describe('Creation Methods', () => {
  test('should be able to get all creations', async context => {
    const { client } = context
    const result = await client.creations.list()
    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
    expect(result.docs.length).toBeGreaterThan(0)
  })

  test('should be able to pass pagination options', async context => {
    const { client } = context
    const result = await client.creations.list({
      limit: 1,
      page: 1,
    })
    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
    expect(result.docs.length).toBe(1)
  })

  test('should be able to get a creation by id', async context => {
    const { client } = context
    const result = await client.creations.list()
    const creationId = result.docs[0]._id
    const creationsResponse = await client.creations.get({
      creationId,
    })
    expect(creationsResponse).toBeDefined()
    expect(creationsResponse.creation).toBeDefined()
  })

  test('should be able to react to a creation', async context => {
    const { client } = context
    const result = await client.creations.list()
    const creationId = result.docs[0]._id
    const reactionResponse = await client.creations.react({
      creationId,
      reaction: 'praise',
    })
    expect(reactionResponse).toBeDefined()
    expect(reactionResponse.success).toBe(true)
  })

  test('should be able to unreaction to a creation', async context => {
    const { client } = context
    const result = await client.creations.list()
    const creationId = result.docs[0]._id
    const unreactionResponse = await client.creations.unreact({
      creationId,
      reaction: 'praise',
    })
    expect(unreactionResponse).toBeDefined()
    expect(unreactionResponse.success).toBe(true)
  })
})

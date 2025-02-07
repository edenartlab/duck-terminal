import { describe, expect, test } from 'vitest'

import { EdenClient } from '../../src'

const getCollectionId = async (client: EdenClient) => {
  const response = await client.collections.list()
  return response.docs[0]._id
}

const getCreationId = async (client: EdenClient) => {
  const response = await client.creations.list()
  return response.docs[0]._id
}

describe('Collection Methods', () => {
  test('should be able to create a collection', async context => {
    const { client } = context
    const result = await client.collections.create({
      name: 'test',
    })
    expect(result).toBeDefined()
    expect(result.collectionId).toBeDefined()
  })

  test('should be able to get all collections', async context => {
    const { client } = context
    const result = await client.collections.list()
    console.log(result)
    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
  })

  test('should be able to get a collection by id', async context => {
    const { client } = context
    const collectionId = await getCollectionId(client)
    const collectionsResponse = await client.collections.get({
      collectionId,
    })
    expect(collectionsResponse).toBeDefined()
    expect(collectionsResponse.collection).toBeDefined()
    expect(collectionsResponse.collection._id).toBe(collectionId)
  })

  test('should be able to update a collection', async context => {
    const { client } = context
    const response = await client.collections.create({
      name: 'test2',
    })
    const collectionId = response.collectionId
    const collectionsResponse = await client.collections.update({
      collectionId,
      name: 'test3',
    })
    expect(collectionsResponse).toBeDefined()
  })

  test('should be able to delete a collection', async context => {
    const { client } = context
    const response = await client.collections.create({
      name: 'test2',
    })
    const collectionsResponse = await client.collections.delete({
      collectionId: response.collectionId,
    })
    expect(collectionsResponse).toBeDefined()
  })

  test('should be able to add creations to a collection', async context => {
    const { client } = context
    const response = await client.collections.create({
      name: 'test2',
    })
    const collectionId = response.collectionId
    const creationId = await getCreationId(client)
    const collectionsResponse = await client.collections.creations.add({
      collectionId,
      creationIds: [creationId],
    })
    expect(collectionsResponse).toBeDefined()
  })

  test('should be able to remove creations from a collection', async context => {
    const { client } = context
    const response = await client.collections.create({
      name: 'test2',
    })
    const collectionId = response.collectionId
    const creationId = await getCreationId(client)
    const collectionsResponse = await client.collections.creations.remove({
      collectionId,
      creationIds: [creationId],
    })
    expect(collectionsResponse).toBeDefined()
  })
})

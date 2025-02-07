import { describe, expect, test } from 'vitest'

import { ScenarioType } from '../../../../apps/api/src/models/Scenario'

describe('Session Methods', () => {
  test('should return a list of sessions', async context => {
    const { client } = context
    const result = await client.sessions.list()
    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
  })

  test('should be able to pass pagination options', async context => {
    const { client } = context
    const result = await client.sessions.list({
      limit: 1,
      page: 1,
    })
    expect(result).toBeDefined()
    expect(result.docs).toBeDefined()
  })

  test('should create a Session', async context => {
    const { client } = context
    const result = await client.sessions.create({
      type: ScenarioType.CHATROOM,
    })
    expect(result).toBeDefined()
    expect(result.sessionId).toBeDefined()
  })

  test('should be able to get session by id', async context => {
    const { client } = context
    const createResults = await client.sessions.list({
      limit: 1,
    })
    const sessionId = createResults.docs[0].id
    const result = await client.sessions.get({
      sessionId,
    })
    expect(result).toBeDefined()
  })

  test('should delete a session', async context => {
    const { client } = context
    const createResults = await client.sessions.list({
      limit: 1,
    })
    const sessionId = createResults.docs[0].id
    const result = await client.sessions.delete({
      sessionId,
    })
    expect(result).toBeDefined()
  })

  test('should be able to get a sessions events', async context => {
    const { client } = context
    const createResults = await client.sessions.list({
      limit: 1,
    })
    const sessionId = createResults.docs[0].id
    const result = await client.session.events.list({
      sessionId,
    })
    expect(result).toBeDefined()
  })
})

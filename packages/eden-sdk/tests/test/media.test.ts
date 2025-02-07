import fs from 'fs'
import { describe, expect, test } from 'vitest'

describe('Media Methods', () => {
  test('user should be able to upload media', async context => {
    const { client } = context
    const filepath = `${__dirname}/../assets/logo.png`
    const media = await fs.readFileSync(filepath)
    const result = await client.media.upload({ media })
    expect(result).toBeDefined()
    expect(result.url).toBeDefined()
  })
})

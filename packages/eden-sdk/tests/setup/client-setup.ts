import { beforeEach } from 'vitest'

import {
  createAdminClient,
  createBasicUserClient,
  createTestClient,
} from '../util'

beforeEach(async context => {
  const client = await createTestClient()
  const basicUserClient = await createBasicUserClient()
  const adminClient = await createAdminClient()
  context.client = client
  context.basicUserClient = basicUserClient
  context.adminClient = adminClient
})

import { EdenClient } from '../src/EdenClient'

export const createTestClient = () => {
  return new EdenClient({
    edenApiUrl: 'http://127.0.0.1:5050',
    apiKey: 'user',
    apiSecret: 'user',
  })
}

export const createBasicUserClient = () => {
  return new EdenClient({
    edenApiUrl: 'http://127.0.0.1:5050',
    apiKey: 'basicuser',
    apiSecret: 'basicuser',
  })
}

export const createAdminClient = () => {
  return new EdenClient({
    edenApiUrl: 'http://127.0.0.1:5050',
    apiKey: 'admin',
    apiSecret: 'admin',
  })
}

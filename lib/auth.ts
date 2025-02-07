import { NextRequest } from 'next/server'

export const getAuthToken = async (req: NextRequest) => {
  const authToken = req.cookies.get('jwt')?.value
  return authToken || undefined
}

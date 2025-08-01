import { headers as nextHeaders } from 'next/headers'
import { auth } from './auth'

export const getSession = async () => {
  const headers = await nextHeaders()
  return await auth.api.getSession({ headers })
}

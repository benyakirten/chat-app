import { sendAuthRequest } from '@/server/utils/account'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return sendAuthRequest(event, 'register', body)
})

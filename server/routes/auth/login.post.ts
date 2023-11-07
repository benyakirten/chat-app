import { sendAuthRequest } from '@/server/utils/account'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  return sendAuthRequest(event, 'login', data)
})

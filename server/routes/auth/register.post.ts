import { REGISTER_SHAPE } from '@/utils/api/shapes'
import { sendAuthRequest } from '@/server/utils/account'

export default defineEventHandler(async (event) => {
  return sendAuthRequest(event, REGISTER_SHAPE, 'register')
})

import axios from 'axios'

import { LOGIN_SHAPE } from '@/utils/api/shapes'
import { sendAuthRequest } from '~/utils/api/account'

export default defineEventHandler(async (event) => {
  return sendAuthRequest(event, LOGIN_SHAPE, 'login')
})

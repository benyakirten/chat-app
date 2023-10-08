import axios from 'axios'

import { REGISTER_SHAPE } from '@/utils/api/shapes'
import { sendAuthRequest } from '~/utils/api/account'

export default defineEventHandler(async (event) => {
  return sendAuthRequest(event, REGISTER_SHAPE, 'register')
})

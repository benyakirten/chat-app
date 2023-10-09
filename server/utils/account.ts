import type { H3Event, EventHandlerRequest } from 'h3'
import { ZodObject } from 'zod'
import axios from 'axios'

import { COMPLETE_AUTH_SHAPE } from '@/utils/api/shapes'
import { MS_IN_ONE_MINUTE } from '@/utils/constants'
import { sign, serialize, setRefreshCookie } from './cookies'

export async function sendAuthRequest(
  event: H3Event<EventHandlerRequest>,
  shape: ZodObject<any>,
  endpoint: 'login' | 'register'
) {
  const body = await readBody(event)
  const parseRes = shape.safeParse(body)
  // TODO: Standardize error response/shape
  if (!parseRes.success) {
    setResponseStatus(event, 400)
    return { error: parseRes.error.errors }
  }

  const res = await axios.post(`/auth/${endpoint}`, parseRes.data)
  if (res.status >= 400) {
    setResponseStatus(event, res.status)
    return res.data
  }

  const dataRes = COMPLETE_AUTH_SHAPE.safeParse(res.data)
  if (!dataRes.success) {
    setResponseStatus(event, 500)
    return { error: { message: 'Data returned from server does not conform to known standards.' } }
  }

  const { auth_token, refresh_token, users, conversations, user } = dataRes.data

  const config = useRuntimeConfig()
  setRefreshCookie(event, config, !!body.rememberMe, refresh_token)

  return { user, conversations, users, auth_token }
}

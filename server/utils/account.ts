import type { H3Event, EventHandlerRequest } from 'h3'
import type { z } from 'zod'
import axios from 'axios'

import { COMPLETE_AUTH_SHAPE, LOGIN_SHAPE, REGISTER_SHAPE } from '@/utils/shapes'
import { setRefreshCookie, setRememberMeCookie } from './cookies'
import { setAuthToken } from './axios'

type AuthRequestData<T extends 'login' | 'register'> = T extends 'login' ? typeof LOGIN_SHAPE : typeof REGISTER_SHAPE
export async function sendAuthRequest(
  event: H3Event<EventHandlerRequest>,
  endpoint: 'login' | 'register',
  data: z.infer<AuthRequestData<typeof endpoint>>
) {
  const shape = endpoint === 'login' ? LOGIN_SHAPE : REGISTER_SHAPE
  const parseRes = shape.safeParse(data)

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
  const { email, password, rememberMe } = parseRes.data
  const { auth_token, refresh_token, users, conversations, user } = dataRes.data

  const config = useRuntimeConfig()
  if (rememberMe) {
    setRememberMeCookie(event, config, email, password)
  }
  setRefreshCookie(event, config, refresh_token)
  setAuthToken(auth_token)

  return { user, conversations, users, auth_token }
}

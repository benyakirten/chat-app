import type { H3Event, EventHandlerRequest } from 'h3'
import { ZodObject } from 'zod'
import axios from 'axios'

import { ACCOUNT_SHAPE } from '@/utils/api/shapes'
import { MS_IN_ONE_MINUTE } from '@/utils/constants'
import { sign, serialize } from './cookies'

export async function sendAuthRequest(
  event: H3Event<EventHandlerRequest>,
  shape: ZodObject<any>,
  endpoint: 'login' | 'register'
) {
  const body = await readBody(event)
  const parseRes = shape.safeParse(body)
  if (!parseRes.success) {
    setResponseStatus(event, 400)
    return { errors: parseRes.error.errors }
  }

  const res = await axios.post(`/auth/${endpoint}`, parseRes.data)
  if (res.status >= 400) {
    setResponseStatus(event, res.status)
    return res.data
  }

  const dataRes = ACCOUNT_SHAPE.safeParse(res.data)
  if (!dataRes.success) {
    console.log(dataRes.error)
    setResponseStatus(event, 500)
    return { error: { message: 'Data returned from response in unexpected shape. Please contact Ben.' } }
  }

  const { auth_token, refresh_token, users, conversations, user } = dataRes.data

  const config = useRuntimeConfig()
  const expiresMs = body.rememberMe ? config.cookieExpires : MS_IN_ONE_MINUTE * 30
  const payload = serialize({ rememberMe: !!body.rememberMe, refreshToken: refresh_token })
  const signedPayload = sign(payload, config.cookieSecret)

  setCookie(event, config.cookieName, signedPayload, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + expiresMs),
  })

  return { user, conversations, users, auth_token }
}

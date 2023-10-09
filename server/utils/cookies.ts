import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event, EventHandlerRequest } from 'h3'

import { MS_IN_ONE_MINUTE } from '@/utils/constants'

// https://github.com/damien-hl/nuxt3-auth-example
export function serialize(obj: object) {
  const value = Buffer.from(JSON.stringify(obj), 'utf-8').toString('base64')
  const length = Buffer.byteLength(value)

  if (length > 4096)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request',
      message: 'Cookie too large',
    })

  return value
}

export function deserialize<T>(value: string): T {
  try {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf-8'))
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request',
      message: 'Unable to deserialize cookie',
    })
  }
}

export function sign(value: string, secret: string) {
  const signature = createHmac('sha256', secret).update(value).digest('base64').replace(/=+$/, '')

  return `${value}.${signature}`
}

export function unsign(input: string, secret: string) {
  const value = input.slice(0, input.lastIndexOf('.'))
  const expectedInput = sign(value, secret)
  const expectedBuffer = Buffer.from(expectedInput)
  const inputBuffer = Buffer.from(input)

  if (!(expectedBuffer.equals(inputBuffer) && timingSafeEqual(expectedBuffer, inputBuffer))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid cookie signature',
      message: 'Invalid cookie signature',
    })
  }

  return value
}

type RuntimeConfig = ReturnType<typeof useRuntimeConfig>
export function setRefreshCookie(event: H3Event<EventHandlerRequest>, config: RuntimeConfig, refreshToken: string) {
  const signedPayload = sign(refreshToken, config.cookieSecret)

  setCookie(event, config.refreshCookieName, signedPayload, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + config.cookieExpires),
  })
}

function unsafeGetCookie(event: H3Event<EventHandlerRequest>, cookieName: string, errorMessage: string): string {
  const cookie = getCookie(event, cookieName)
  if (!cookie) {
    throw createError({
      statusCode: 500,
      message: errorMessage,
    })
  }

  return cookie
}

export function getRefreshCookie(event: H3Event<EventHandlerRequest>, config: RuntimeConfig): string {
  const cookie = unsafeGetCookie(event, config.refreshCookieName, 'Refresh token cookie absent')
  return unsign(cookie, config.cookieSecret)
}

export function setRememberMeCookie(
  event: H3Event<EventHandlerRequest>,
  config: RuntimeConfig,
  email: string,
  password: string
) {
  const serialized = serialize({ email, password })
  const signedPayload = sign(serialized, config.cookieSecret)

  setCookie(event, config.rememberMeCookieName, signedPayload, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + config.cookieExpires),
  })
}

export function getRememberMeCookie(
  event: H3Event<EventHandlerRequest>,
  config: RuntimeConfig
): { email: string; password: string } | null {
  const cookie = getCookie(event, config.rememberMeCookieName)
  if (!cookie) {
    return null
  }

  const serializedPayload = unsign(cookie, config.cookieSecret)
  return deserialize(serializedPayload)
}

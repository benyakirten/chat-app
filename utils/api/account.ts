import axios from 'axios'
import type { H3Event, EventHandlerRequest } from 'h3'
import { ZodObject } from 'zod'

export async function sendAuthRequest(
  event: H3Event<EventHandlerRequest>,
  shape: ZodObject<any>,
  endpoint: 'login' | 'register'
) {
  const backendUrl = process.env['BACKEND_URL']
  if (!backendUrl) {
    setResponseStatus(event, 500)
    return { errors: 'Server is missing the following configuration option: BACKEND_URL' }
  }

  try {
    const body = await readBody(event)
    const parseRes = shape.safeParse(body)
    if (!parseRes.success) {
      setResponseStatus(event, 400)
      return { errors: parseRes.error.errors }
    }

    const res = await axios.post(`/auth/${endpoint}`, parseRes.data)
    console.log(res)

    // setCookie(event, 'ME', 'ME', {
    //   httpOnly: true,
    //   path: '/',
    //   sameSite: 'lax',
    //   secure: process.env.NODE_ENV === 'production',
    // })
    return { yes: 'no' }
  } catch (error) {
    console.error(error)
  }
}

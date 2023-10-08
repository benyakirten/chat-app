import axios from 'axios'
import { LOGIN_SHAPE } from '~/utils/api'

export default defineEventHandler(async (event) => {
  const backendUrl = process.env['A']
  if (!backendUrl) {
    setResponseStatus(event, 500)
    return { errors: 'Server is missing the following configuration option: BACKEND_URL' }
  }
  try {
    const body = await readBody(event)
    const parseRes = LOGIN_SHAPE.safeParse(body)
    if (!parseRes.success) {
      setResponseStatus(event, 400)
      return { errors: parseRes.error.errors }
    }

    const res = await axios.post(`/auth/login`, parseRes.data)
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
})

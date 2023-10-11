import axios from 'axios'

import { UPDATE_PROFILE_SETTINGS_SHAPE } from '@/utils/shapes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const shape = UPDATE_PROFILE_SETTINGS_SHAPE.safeParse(body)

  if (!shape.success) {
    setResponseStatus(event, 400)
    return { error: shape.error.errors }
  }

  const res = await axios.patch('/api/profile', shape.data)
  setResponseStatus(event, res.status)
  return res.data
})

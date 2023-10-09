import axios from 'axios'

import { RECENTS_DATA_SHAPE } from '@/utils/shapes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const shape = RECENTS_DATA_SHAPE.safeParse(body)

  if (!shape.success) {
    setResponseStatus(event, 400)
    return { error: shape.error.errors }
  }

  const res = await axios.post('/api/recents', shape.data)
  setResponseStatus(event, res.status)
  return res.data
})

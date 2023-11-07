import axios from 'axios'
import { ServerEvent } from './account'

export function sendAuthedRequest(
  event: ServerEvent,
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  body?: object
) {
  const authHeader = getHeader(event, 'Authorization')
  if (method === 'get' || method === 'delete') {
    return axios[method](url, { headers: { Authorization: authHeader } })
  }
  return axios[method](url, body, { headers: { Authorization: authHeader } })
}

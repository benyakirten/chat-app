import axios from 'axios'

import { setApiUrl } from '../utils/axios'

export default defineEventHandler(() => {
  if (axios.defaults.baseURL) {
    return
  }

  const apiUrl = process.env['API_BASE_URL']
  if (!apiUrl) {
    throw new Error('API_BASE_URL environment variable must be defined')
  }

  setApiUrl(apiUrl)
})

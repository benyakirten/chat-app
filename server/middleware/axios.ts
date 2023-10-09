import axios from 'axios'

export default defineEventHandler(() => {
  if (axios.defaults.baseURL) {
    return
  }

  const apiUrl = process.env['API_BASE_URL']
  if (!apiUrl) {
    throw new Error('API_BASE_URL environment variable must be defined')
  }

  axios.defaults.baseURL = apiUrl
  axios.defaults.validateStatus = () => true
})

import axios from 'axios'

export default defineEventHandler(() => {
  if (axios.defaults.baseURL) {
    return
  }

  const config = useRuntimeConfig()
  axios.defaults.baseURL = config.public.apiUrl
  axios.defaults.validateStatus = () => true
})

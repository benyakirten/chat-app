import axios from 'axios'

export function setApiUrl(url: string) {
  axios.defaults.baseURL = url
  axios.defaults.validateStatus = () => true
}

export function setAuthToken(token: string) {
  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`
    return config
  })
}

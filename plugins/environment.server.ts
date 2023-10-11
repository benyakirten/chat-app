export default defineNuxtPlugin((app) => {
  const { apiUrl, wsUrl } = app.$config.public

  let missingEnvViariables: string[] = []
  if (!wsUrl) {
    missingEnvViariables.push('WS_URL')
  }
  if (!apiUrl) {
    missingEnvViariables.push('API_BASE_URL')
  }

  if (missingEnvViariables.length > 0) {
    throw new Error(`${missingEnvViariables.join(', ')} environment variable(s) must be defined`)
  }
})

export const NO_AUTH_ROUTES_REGEX = /login|about/

export function doesNotNeedLogin(path: string): boolean {
  return NO_AUTH_ROUTES_REGEX.test(path)
}

export const formatAuthErrors = (error: { message: string } | { message: string }[]): string => {
  const message: string = Array.isArray(error) ? error.map((e) => e.message).join(', ') : error.message
  return `The following errors occurred: ${message}`
}

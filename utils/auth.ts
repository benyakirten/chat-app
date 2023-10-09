export const NO_AUTH_ROUTES_REGEX = /login|about/

export function doesNotNeedLogin(path: string): boolean {
  return NO_AUTH_ROUTES_REGEX.test(path)
}

export async function performRefresh() {
  // TODO:
}

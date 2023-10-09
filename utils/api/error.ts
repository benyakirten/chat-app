export const formatAuthErrors = (error: { message: string } | { message: string }[]): string => {
  const message: string = Array.isArray(error) ? error.map((e) => e.message).join(', ') : error.message
  return `The following errors occurred: ${message}`
}

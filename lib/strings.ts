export const camelToKebabCase = (word: string) =>
  word.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()

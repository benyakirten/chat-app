export const camelToKebabCase = (word: string) => word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

export const TITLE_CASE_WORDS_TO_IGNORE = [
  'and',
  'as',
  'but',
  'for',
  'if',
  'nor',
  'or',
  'so',
  'yet',
  'as',
  'at',
  'by',
  'for',
  'in',
  'of',
  'off',
  'on',
  'per',
  'to',
  'up',
  'via',
  'a',
  'an',
  'the',
]

export const capitalize = (word: string) => `${word.charAt(0).toLocaleUpperCase()}${word.slice(1)}`
// TODO: Make this easier to parse
export const titleCase = (sentence: string) => {
  const words = sentence.split(' ')
  if (words[0].length === 0) {
    return sentence
  }

  const casedWords = words.slice(1).map((word) => (word in TITLE_CASE_WORDS_TO_IGNORE ? word : capitalize(word)))
  // First word always gets capitalized
  return `${capitalize(words[0])} ${casedWords.join(' ')}`
}

export const camelToKebabCase = (word: string) => word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
export const capitalize = (word: string) => {
  word = word.trim()
  return `${word.trim().charAt(0).toUpperCase()}${word.slice(1)}`
}

const TITLE_CASE_WORDS_TO_IGNORE = [
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
export const titleCase = (sentence: string) => {
  const words = sentence.split(' ')
  if (words[0].length === 0) {
    return sentence
  }

  const casedWords = words.slice(1).map((word) => (TITLE_CASE_WORDS_TO_IGNORE.includes(word) ? word : capitalize(word)))
  // First word always gets capitalized
  return `${capitalize(words[0])} ${casedWords.join(' ')}`
}

/**
 * Given a new value and an old value, find out how many characters from old value
 * must be deleted so that the two strings are equal.
 */
export function calculateCharactersInCommon(newValue: string, oldValue: string, ignoreCase?: boolean): number {
  if (ignoreCase) {
    newValue = newValue.toUpperCase()
    oldValue = oldValue.toUpperCase()
  }

  let sameLetterCount = 0
  for (let i = 0; i < oldValue.length; i++) {
    const newChar = newValue.charAt(i),
      oldChar = oldValue.charAt(i)
    if (newChar && newChar === oldChar) {
      sameLetterCount++
    } else {
      break
    }
  }
  return sameLetterCount
}

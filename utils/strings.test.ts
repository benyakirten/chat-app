import { describe, expect, it, test } from 'vitest'

import { calculateCharactersInCommon, camelToKebabCase, capitalize, titleCase } from './strings'

describe('camelToKebabCase', () => {
  test.each([
    { input: '', want: '' },
    { input: 'coolThing', want: 'cool-thing' },
    { input: ' myPropertyHere', want: ' my-property-here' },
    { input: '   ', want: '   ' },
    { input: 'my_property_here', want: 'my_property_here' },
  ])('should return $want given an input of $input', ({ input, want }) => {
    const got = camelToKebabCase(input)
    expect(got).toEqual(want)
  })
})

describe('titleCase', () => {
  test.each([
    { input: '', want: '' },
    { input: 'but there I go', want: 'But There I Go' },
    { input: 'something and another', want: 'Something and Another' },
  ])('should return $want given an input of $input', ({ input, want }) => {
    const got = titleCase(input)
    expect(got).toEqual(want)
  })
})

describe('capitalize', () => {
  test.each([
    { input: '', want: '' },
    { input: 'hello', want: 'Hello' },
    { input: ' hello', want: 'Hello' },
  ])('should return $want given an input of $input', ({ input, want }) => {
    const got = capitalize(input)
    expect(got).toEqual(want)
  })
})

describe('calculateCharactersInCommon', () => {
  it('should return 0 if the strings do not begin with the same letter', () => {
    const got = calculateCharactersInCommon(' hello there, how are you doing?', 'hello there, how are you doing?')
    expect(got).toEqual(0)
  })

  it('should return the length of the string if all characters are the same in the same case if ignore case is false', () => {
    const got = calculateCharactersInCommon('hello there, HOW ARE you?', 'hello there, HOW ARE you?')
    expect(got).toEqual(25)
  })

  it('should return the amount of characters in common case dependent if ignore case is false', () => {
    const got = calculateCharactersInCommon('hello there, HOW ARE you?', 'hello there, how are you?')
    expect(got).toEqual(13)
  })

  it('should return the amount of characters in common independent of case if ignore case is true', () => {
    const got = calculateCharactersInCommon('èÏ', 'Èï', true)
    expect(got).toEqual(2)
  })
})

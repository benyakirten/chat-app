import { describe, expect, it, test } from 'vitest'

import { camelToKebabCase, titleCase, capitalize } from './strings'

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

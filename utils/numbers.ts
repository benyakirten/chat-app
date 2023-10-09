export const clamp = (min: number, max: number, value: number) => {
  if (value < min) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}

export const withinRange = (num: number, min: number, max: number) => num >= min && num <= max

/**
 * This rem wraps around ranges in case of negative numbers
 * e.g. -1 % 5 in Python is 4 but -1 % 5 in JS is -1
 */
export const rem = (n: number, m: number) => ((n % m) + m) % m

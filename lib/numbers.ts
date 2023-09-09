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
 * True modulus - handles negative numers
 */
export const mod = (n: number, m: number) => ((n % m) + m) % m

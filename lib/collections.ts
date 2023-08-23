export const arrayify = <T>(item: T | T[]) => Array.isArray(item) ? item : [item]
export const getOtherMapKey = <T, U>(map: Map<T, U>, key: T): T | null => {
  for (const mapKey of map.keys()) {
    if (mapKey !== key) {
      return mapKey
    }
  }

  return null
}

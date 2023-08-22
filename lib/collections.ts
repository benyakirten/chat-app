const arrayify = <T>(item: T | T[]) => Array.isArray(item) ? item : [item]
const getOtherMapKey = <T, U>(map: Map<T, U>, key: T) => {
  for (const [mapKey] of map) {
    if (mapKey !== key) {
      return mapKey
    }
  }

  return null
}

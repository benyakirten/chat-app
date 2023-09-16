export const arrayify = <T>(item: T | T[]) => (Array.isArray(item) ? item : [item])
export const getFirstSetItem = <T>(set: Set<T>): T | undefined => set.keys().next().value

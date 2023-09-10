export const waitFor = async (time: number) => new Promise((fulfill) => setTimeout(() => fulfill(true), time))

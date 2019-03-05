export const memoize = function <T extends (...args: any[]) => (...args: any[]) => any >(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    const value = cache.get(key);
    if (value) {
      return value
    } else {
      // @ts-ignore
      const result = fn.apply(this, args)
      cache.set(key, result)
      return result
    }
  }
}
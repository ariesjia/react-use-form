export const omit = (obj, keys) => {
  return Object.keys(obj)
    .filter((key) => keys.indexOf(key) < 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {})
    ;
}
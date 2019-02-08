export const mapValues = (obj, fn) =>
  Object.keys(obj).reduce((prev, k) => {
    prev[k] = fn(obj[k], k, obj);
    return prev;
  }, {});
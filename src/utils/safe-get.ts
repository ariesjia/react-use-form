export const get = (object, name, defaultValue?) => {
    let result = object
    // @ts-ignore
    name.split('.').forEach(item => {
        if (!result) {
            return undefined
        }
        result = result[item]
    })
    return result === undefined ? defaultValue : result
}
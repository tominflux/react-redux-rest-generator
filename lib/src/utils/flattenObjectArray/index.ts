/**
 * Flattens an object array into an array of values.
 */
const flattenObjectArray = (objArray: Array<Record<string, unknown>>) =>
    objArray.map((obj) => Object.values(obj)).flat(1)

export default flattenObjectArray

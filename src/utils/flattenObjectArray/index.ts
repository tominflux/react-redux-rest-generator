/**
 * Flattens an array of objects of primitives into an array of primitives.
 */
const flattenPrimitiveObjectArray: (
  objArray: Array<Record<string, string | number | boolean | null>>
) => Array<string | number | boolean | null> = (objArray) =>
  objArray.map((obj) => Object.values(obj)).flat(1)

export default flattenPrimitiveObjectArray

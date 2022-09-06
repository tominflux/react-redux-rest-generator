/**
 * Converts an array of primitives into a single string.
 */
const concatPrimitivesToString: (
  primitives: Array<string | number | boolean | null>
) => string = (primitives) =>
  primitives.reduce<string>((accumulated, current) => {
    if (accumulated === '') return `${current}`
    return `${accumulated}-${current}`
  }, '')

export default concatPrimitivesToString

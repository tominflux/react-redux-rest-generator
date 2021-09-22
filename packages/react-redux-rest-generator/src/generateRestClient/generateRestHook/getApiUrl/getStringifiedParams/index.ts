import mapObj from '../../../../utils/mapObj'

const getStringifiedParams: (
  params: Record<string, unknown>
) => Record<string, string> = (params) =>
  mapObj(params, (key, value) => {
    const param = value as unknown

    // Return null values as is
    if (param === null) {
      return { key, value: null }
    }

    // Return string as is
    if (typeof param === 'string') return { key, value: param }

    // Return array as CSV
    if (typeof param === 'object') {
      if (Array.isArray(param)) {
        const arrayParam = param as Array<string | number | boolean>
        const stringifiedSubValues = arrayParam.map((subValue) => {
          if (typeof subValue === 'string') return subValue
          if ((subValue.toString ?? null) !== null) return subValue.toString()
          throw new Error(
            `Cannot stringify sub-value of read parameter '${key}'. ` +
              `Array element is not a string and has no 'toString' method.`
          )
        })
        const escapedSubValues = stringifiedSubValues.map((subValue) =>
          escape(subValue)
        )
        const csv = escapedSubValues.join(',')
        return { key, value: csv }
      }
      // Reject object
      throw new Error(
        `Cannot stringify read parameter '${key}'. ` +
          `Object (non-array) is not an acceptable read parameter type.`
      )
    }

    // Attempt to use toString on any other type
    const potentiallyStringable = param as { toString?: () => string }
    if ((potentiallyStringable.toString ?? null) !== null) {
      const stringable = potentiallyStringable as { toString: () => string }
      return { key, value: stringable.toString() }
    }

    throw new Error(
      `Cannot stringify read parameter '${key}'. ` +
        `Parameter is not a string or an array and has no 'toString' method.`
    )
  }) as Record<string, string>

export default getStringifiedParams

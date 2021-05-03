import * as path from 'path'

const getApiUrlSingleAnon: (
  parentsIdentifier: Record<string, string>,
  resourceConfig: RestResourceConfig
) => string = (parentsIdentifier, resourceConfig) => {
  const { apiRootPath, composition } = resourceConfig

  // Build parents resource segment of route ('.../parent1/abc/parent2/abc/...')
  const parents: Array<string> = (composition ?? []).reduce<Array<string>>(
    (previous, parentResourceConfig, index) => {
      // Ensure parent config not nullish
      const isParentConfigNullish = (parentResourceConfig ?? null) === null
      if (isParentConfigNullish) {
        throw new Error(
          `Parent resource config [index=${index}] for resource ` +
            `${resourceConfig.name} is nullish.`
        )
      }
      const parentName = parentResourceConfig.name

      // Ensure parent name not nullish
      const isParentNameNullish = (parentName ?? null) === null
      if (isParentNameNullish) {
        throw new Error(
          `Name of parent resource config [index=${index}] for resource ` +
            `${resourceConfig.name} is nullish.`
        )
      }

      // Ensure parent name is string
      const isParentNameString = typeof parentName === 'string'
      if (!isParentNameString) {
        throw new Error(
          `Name of parent resource config [index=${index}] for resource ` +
            `${resourceConfig.name} is of type ${typeof parentName}, ` +
            `expected string.`
        )
      }

      // Get parent's primary identifier key from parent config
      const primaryIdentifierKey = parentResourceConfig.primaryIdentifier

      // Ensure parent's primary identifier key is not nullish
      if ((primaryIdentifierKey ?? null) === null) {
        throw new Error(
          `Primary identifier key of parent ${parentResourceConfig.name} for resource ` +
            `${resourceConfig.name} is nullish.`
        )
      }

      // Ensure parent's primary identifier key is string
      if (typeof primaryIdentifierKey !== 'string') {
        throw new Error(
          `Primary identifier key of parent ${parentResourceConfig.name} for resource ` +
            `${resourceConfig.name} is of type ` +
            `${typeof primaryIdentifierKey}, expected string.`
        )
      }

      // Get parent's primary identifier from parents identifier
      const id = parentsIdentifier[primaryIdentifierKey]

      // Ensure parent's primary identifier is not nullish
      if ((id ?? null) === null) {
        throw new Error(
          `Primary identifier of parent ${parentResourceConfig.name} ` +
            `for resource ${resourceConfig.name} is nullish.`
        )
      }

      // Ensure parent's primary identifier is string
      if (typeof id !== 'string') {
        throw new Error(
          `Primary identifier of parent ${parentResourceConfig.name} ` +
            `for resource ${resourceConfig.name} is of type ${typeof id}, ` +
            `expected string.`
        )
      }

      return [...previous, parentName, id]
    },
    []
  )

  // Append child resource segment of route ('.../child')
  const child = resourceConfig.name

  // Put together URL
  const url = path.join(apiRootPath ?? '/api', ...parents, child)

  return `${url}`
}

export default getApiUrlSingleAnon

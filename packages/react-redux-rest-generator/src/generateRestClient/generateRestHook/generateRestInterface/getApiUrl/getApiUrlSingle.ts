import * as path from 'path'
import { RestSingleApiUrlGetter, RestResourceConfig } from '../../../../types'

const getApiUrlSingle: RestSingleApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  compositeIdentifier: CompositeIdentifierType,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
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
      const primaryIdentifierKey = resourceConfig.identifiers[index]

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

      // Get parent's primary identifier from composite identifier
      const id = ((compositeIdentifier as unknown) as Record<string, string>)[
        primaryIdentifierKey
      ]

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

  // TODO: camel to snake case
  // Build child resource segment of route ('.../child/abc123')
  const childId = ((compositeIdentifier as unknown) as Record<string, string>)[
    resourceConfig.primaryIdentifier
  ]
  const child: Array<string> = [resourceConfig.name, childId]

  const trail = path.join(apiRootPath ?? '/api', ...parents, ...child)

  return `${trail}`
}

export default getApiUrlSingle

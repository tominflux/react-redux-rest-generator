import * as path from 'path'
import { RestManyApiUrlGetter, RestResourceConfig } from '../../../types'
import getStringifiedParams from './getStringifiedParams'

const getApiUrlMany: RestManyApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  params?: ReadParamsType
) => {
  const { apiRootPath, composition } = resourceConfig

  // Build parents resource segment of route ('.../parent1/parent2/...')
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

      // Add parent name to list
      return [...previous, parentName]
    },
    []
  )

  // Append child resource segment of route ('.../child')
  const child = resourceConfig.name

  // Put together URL
  const url = path.join(apiRootPath ?? '/api', ...parents, child)

  // Create query-string
  const urlParams = params
    ? getStringifiedParams(params as Record<string, unknown>)
    : {}
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter((entry) => entry[1] !== null)
  )
  const query = new URLSearchParams(filteredUrlParams)

  return `${url}?${query}`
}

export default getApiUrlMany

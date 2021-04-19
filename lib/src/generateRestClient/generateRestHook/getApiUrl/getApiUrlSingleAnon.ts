import * as path from 'path'

const getApiUrlSingleAnon: (
  parentsIdentifier: Record<string, string>,
  resourceConfig: RestResourceConfig
) => string = (parentsIdentifier, resourceConfig) => {
  const { apiRootPath, composition } = resourceConfig

  // Build parents resource segment of route ('.../parent1/abc/parent2/abc/...')
  const parents: Array<string> = (composition ?? []).reduce<Array<string>>(
    (previous, current) => {
      const identifier = current.primaryIdentifier
      const id = parentsIdentifier[identifier]

      return [...previous, current.name, id]
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

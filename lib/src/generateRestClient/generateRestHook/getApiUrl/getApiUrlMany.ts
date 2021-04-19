import mapObj from 'lib/utils/mapObj'
import * as path from 'path'

const getApiUrlMany: (
    resourceConfig: RestResourceConfig,
    params?: Record<string | number | symbol, unknown>
) => string = (resourceConfig, params) => {
    const { apiRootPath, composition } = resourceConfig

    // Build parents resource segment of route ('.../parent1/parent2/...')
    const parents: Array<string> = (composition ?? []).reduce((previous, current) => {
        // TODO: camel to snake case
        return [...previous, current.name]
    }, [])

    // Append child resource segment of route ('.../child')
    const child = resourceConfig.name

    // Put together URL
    const url = path.join(apiRootPath ?? '/api', ...parents, child)

    // Create query-string
    const urlParams = params
        ? (mapObj(params, (key, value) => ({
              key,
              value: typeof value === 'string' ? value : value.toString()
          })) as Record<string, string>)
        : {}
    const query = new URLSearchParams(urlParams)

    return `${url}?${query}`
}

export default getApiUrlMany

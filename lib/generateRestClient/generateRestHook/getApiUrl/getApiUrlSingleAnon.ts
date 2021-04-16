import * as path from 'path'

const getApiUrlSingleAnon: (
    parentsIdentifier: Record<string | number | symbol, unknown>,
    resourceConfig: RestResourceConfig
) => string = (parentsIdentifier, resourceConfig) => {
    const { apiRootPath, composition } = resourceConfig

    // Build parents resource segment of route ('.../parent1/abc/parent2/abc/...')
    const parents: Array<string> = (composition ?? []).reduce((previous, current) => {
        const identifier = current.primaryIdentifier
        const id = parentsIdentifier[identifier]
        const isIdString = typeof id === 'string'
        const idString = isIdString ? id : id.toString()

        return [...previous, current.name, idString]
    }, [])

    // Append child resource segment of route ('.../child')
    const child = resourceConfig.name

    // Put together URL
    const url = path.join(apiRootPath ?? '/api', ...parents, child)

    return `${url}`
}

export default getApiUrlSingleAnon

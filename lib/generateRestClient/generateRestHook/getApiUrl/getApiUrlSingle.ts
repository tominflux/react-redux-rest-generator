import * as path from 'path'

const getApiUrlSingle: (
    compositeIdentifier: Record<string | number | symbol, unknown>,
    resourceConfig: RestResourceConfig
) => string = (compositeIdentifier, resourceConfig) => {
    const { apiRootPath, composition } = resourceConfig

    // Build parents resource segment of route ('.../parent1/abc/parent2/abc/...')
    const parents: Array<string> = (composition ?? []).reduce((previous, current) => {
        // TODO: camel to snake case
        const identifier = current.primaryIdentifier
        const id = compositeIdentifier[identifier]
        const isIdString = typeof id === 'string'
        const idString = isIdString ? id : id.toString()

        return [...previous, current.name, idString]
    }, [])

    // TODO: camel to snake case
    // Build child resource segment of route ('.../child/abc123')
    const childId = compositeIdentifier[resourceConfig.primaryIdentifier]
    const isIdString = typeof childId === 'string'
    const childIdString = (isIdString ? childId : childId.toString()) as string
    const child: Array<string> = [resourceConfig.name, childIdString]

    const trail = path.join(apiRootPath ?? '/api', ...parents, ...child)

    return `${trail}`
}

export default getApiUrlSingle

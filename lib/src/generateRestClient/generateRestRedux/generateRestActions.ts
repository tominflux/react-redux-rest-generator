import mapObj from 'lib/utils/mapObj'

const actionsTemplate = {
    SET_FIELD: 'SET_FIELD',
    FETCH: 'FETCH',
    RESPONSE: 'RESPONSE',
    INVALIDATE: 'INVALIDATE',
    CLEAR_FIELDS: 'CLEAR_FIELDS',
    CLEAR_RESPONSE: 'CLEAR_RESPONSE'
}

const generateRestActions: (resourceConfig: RestResourceConfig) => RestReduxActionSet = (
    resourceConfig
) => {
    const { name: resourceName } = resourceConfig

    const actions = mapObj(actionsTemplate, (key, value) => ({
        key,
        value: `${resourceName.toUpperCase()}_${value}`
    }))

    return actions as RestReduxActionSet
}

export default generateRestActions

import reduceResourceList from 'lib/utils/reduceResourceList'

const getInitialState: (
    initialFields: Record<string | number | symbol, unknown>
) => RestReduxState = (initialFields) => ({
    fields: initialFields,
    resourceList: [],
    fetching: false,
    method: null,
    status: null,
    message: null,
    invalidationIndex: 0,
    compositeIdentifier: null
})

const generateRestReducer: (
    actions: RestReduxActionSet,
    resourceConfig: RestResourceConfig
) => RestReducer = (actions, resourceConfig) => (
    state = getInitialState(resourceConfig.initialFields),
    action
) => {
    switch (action.type) {
        case actions.SET_FIELD: {
            const { name, value } = action.payload
            const fields = {
                ...state.fields,
                [name]: value
            }
            return {
                ...state,
                fields
            }
        }
        case actions.FETCH: {
            const { method } = action.payload
            return {
                ...state,
                fetching: true,
                method,
                status: null,
                message: null,
                ...(method !== 'get' ? { compositeIdentifier: null } : {})
            }
        }
        case actions.RESPONSE: {
            const { status, message, apiPayload } = action.payload
            // Handle read responses
            if (state.method === 'get') {
                const { resourceList } = apiPayload
                const newResourceList = resourceList ?? []
                const nextResourceList = reduceResourceList(
                    state.resourceList,
                    newResourceList,
                    resourceConfig.identifiers
                )
                return {
                    ...state,
                    resourceList: nextResourceList,
                    fetching: false,
                    status,
                    message
                }
            }
            // Handle create responses
            if (state.method === 'post') {
                const { compositeIdentifier } = apiPayload
                return {
                    ...state,
                    fetching: false,
                    status,
                    message,
                    compositeIdentifier: compositeIdentifier ?? null
                }
            }
            // Handle update/delete responses
            return {
                ...state,
                fetching: false,
                status,
                message
            }
        }
        case actions.INVALIDATE: {
            return {
                ...state,
                resourceList: [],
                invalidationIndex: state.invalidationIndex + 1
            }
        }
        case actions.CLEAR_FIELDS: {
            return {
                ...state,
                fields: resourceConfig.initialFields
            }
        }
        case actions.CLEAR_RESPONSE: {
            return {
                ...state,
                fetching: false,
                method: null,
                status: null,
                message: null,
                compositeIdentifier: null
            }
        }
        default:
            return state
    }
}

export default generateRestReducer

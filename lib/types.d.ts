// Core

type RestResourceConfig = {
    name: string
    identifiers: Array<string>
    primaryIdentifier: string
    initialFields: Record<string | number | symbol, unknown>
    filter?: (
        resource: Record<string | number | symbol, unknown>,
        params: Record<string | number | symbol, unknown>
    ) => boolean
    sort?: (
        resourceA: Record<string | number | symbol, unknown>,
        resourceB: Record<string | number | symbol, unknown>,
        params: Record<string | number | symbol, unknown>
    ) => number
    apiRootPath?: string // /api
    composition?: Array<RestResourceConfig>
    stateName?: string
    apiPayloadResourceListName?: string
}

type RestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

// Redux

type RestReduxActionIdentifier =
    | 'SET_FIELD'
    | 'FETCH'
    | 'RESPONSE'
    | 'INVALIDATE'
    | 'CLEAR_FIELDS'
    | 'CLEAR_RESPONSE'

type RestReduxActionSet = Record<RestReduxActionIdentifier, string>

type RestReduxCreatorSet = {
    setField: (
        name: string,
        value: unknown
    ) => {
        type: string
        payload: {
            name: string
            value: unknown
        }
    }
    fetch: (
        method: RestMethod
    ) => {
        type: string
        payload: { method: RestMethod }
    }
    response: (
        status: number,
        message: string,
        apiPayload: {
            compositeIdentifier?: Record<string | number | symbol, unknown>
            resourceList?: Array<Record<string | number | symbol, unknown>>
        } | null
    ) => {
        type: string
        payload: {
            status: number
            message: string
            apiPayload: {
                compositeIdentifier?: Record<string | number | symbol, unknown>
                resourceList?: Array<Record<string | number | symbol, unknown>>
            } | null
        }
    }
    invalidate: () => { type: string; payload: {} }
    clearFields: () => { type: string; payload: {} }
    clearResponse: () => { type: string; payload: {} }
}

type RestReduxState = {
    fields: Record<string | number | symbol, unknown>
    resourceList: Array<Record<string | number | symbol, unknown>>
    fetching: boolean
    method: RestMethod
    status: number
    message: string
    invalidationIndex: number
    compositeIdentifier: Record<string | number | symbol, unknown>
}

type RestReducer = (state: RestReduxState, action: Action) => RestReduxState

// Hook

type RestInterface = {
    fetching: boolean
    method: RestMethod
    status: number
    message: string
    create: (
        parentsIdentifier?: Record<string | number | symbol, unknown>
    ) => Promise<{
        status: number
        message: string
        compositeIdentifier: Record<string | number | symbol, unknown> | null
    }>
    read: (
        params: Record<string | number | symbol, unknown>
    ) => Promise<{
        status: number
        message: string
        resourceList: Array<Record<string | number | symbol, unknown>>
    }>
    update: (
        compositeIdentifier: Record<string | number | symbol, unknown>
    ) => Promise<{ status: number; message: string }>
    delete: (
        compositeIdentifier: Record<string | number | symbol, unknown>
    ) => Promise<{ status: number; message: string }>
    getField: (name: string) => unknown
    setField: (name: string, value: unknown) => void
    clearFields: () => void
    clearResponse: () => void
    getMany: (
        params?: Record<string | number | symbol, unknown>
    ) => Array<Record<string | number | symbol, unknown>>
    getOne: (
        compositeIdentifier: Record<string | number | symbol, unknown>
    ) => Record<string | number | symbol, unknown>
    invalidate: () => void
}

type RestHook = (
    paramsList?: Array<Record<string | number | symbol, unknown>>,
    readExplicitly?: boolean
) => RestInterface

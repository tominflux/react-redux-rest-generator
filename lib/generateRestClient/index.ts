import generateRestHook from './generateRestHook'
import generateRestRedux from './generateRestRedux'

const generateRestClient = <
    CompositeIdentifierType extends Record<string | number | symbol, unknown>,
    AnonResourceType extends Record<string | number | symbol, unknown>,
    ReadParamsType extends Record<string | number | symbol, unknown>
>(
    resourceConfig: RestResourceConfig
) => {
    const redux = generateRestRedux(resourceConfig)
    const hook = generateRestHook(redux.creators, resourceConfig)

    return {
        reducer: redux.reducer,
        hook: hook as (
            paramsList?: Array<ReadParamsType>,
            readExplicitly?: boolean
        ) => {
            fetching: boolean
            method: RestMethod
            status: number
            message: string
            create: (
                parentsIdentifier?: CompositeIdentifierType
            ) => Promise<{
                status: number
                message: string
                compositeIdentifier: CompositeIdentifierType | null
            }>
            read: (
                params: ReadParamsType
            ) => Promise<{
                status: number
                message: string
                resourceList: Array<CompositeIdentifierType & AnonResourceType>
            }>
            update: (
                compositeIdentifier: CompositeIdentifierType
            ) => Promise<{ status: number; message: string }>
            delete: (
                compositeIdentifier: CompositeIdentifierType
            ) => Promise<{ status: number; message: string }>
            getField: (name: keyof AnonResourceType) => unknown
            setField: (name: keyof AnonResourceType, value: unknown) => void
            clearFields: () => void
            clearResponse: () => void
            getMany: (params?: ReadParamsType) => Array<CompositeIdentifierType & AnonResourceType>
            getOne: (
                compositeIdentifier: CompositeIdentifierType
            ) => CompositeIdentifierType & AnonResourceType
            invalidate: () => void
        }
    }
}

export default generateRestClient

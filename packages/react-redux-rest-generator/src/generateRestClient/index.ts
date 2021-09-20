import generateRestHook from './generateRestHook'
import generateRestRedux from './generateRestRedux'
import { default as getGenericInitialState } from './generateRestRedux/getInitialState'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const generateRestClient = <
  CompositeIdentifierType extends Record<string, string>,
  AnonResourceType extends Record<string, unknown>,
  ReadParamsType extends Record<string, RestReadParam>
>(
  resourceConfig: RestResourceConfig
) => {
  const redux = generateRestRedux(resourceConfig)
  const hook = generateRestHook(redux.creators, resourceConfig)
  const getInitialState = () =>
    getGenericInitialState(resourceConfig.initialFields)

  return {
    config: resourceConfig,
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
        parentsIdentifier?: Record<string, string>
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
        compositeIdentifier: CompositeIdentifierType,
        overrideData?: CompositeIdentifierType & AnonResourceType
      ) => Promise<{ status: number; message: string }>
      delete: (
        compositeIdentifier: CompositeIdentifierType
      ) => Promise<{ status: number; message: string }>
      getField: (name: keyof AnonResourceType) => unknown
      setField: (name: keyof AnonResourceType, value: unknown) => void
      clearFields: () => void
      clearResponse: () => void
      getMany: (
        params?: ReadParamsType
      ) => Array<CompositeIdentifierType & AnonResourceType>
      getOne: (
        compositeIdentifier: CompositeIdentifierType
      ) => CompositeIdentifierType & AnonResourceType
      invalidate: () => void
    },
    getInitialState,
  }
}

export default generateRestClient

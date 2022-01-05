import { RestHook } from './generateRestHook/types'
import { RestReduxInitialStateGetter } from './generateRestRedux/generateInitialStateGetter/types'
import { RestReducer } from './generateRestRedux/generateRestReducer/types'

export type RestResourceConfig<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  name: string
  identifiers: Array<string>
  primaryIdentifier: string
  initialFields: AnonResourceType
  filter?: (
    resource: AnonResourceType,
    params: ReadParamsType | Record<string, never>,
    index?: number
  ) => boolean
  sort?: (
    resourceA: AnonResourceType,
    resourceB: AnonResourceType,
    params: ReadParamsType | Record<string, never>
  ) => number
  postProcess?: (
    resourceList: Array<CompositeIdentifierType & AnonResourceType>,
    params: ReadParamsType | Record<string, never>
  ) => Array<CompositeIdentifierType & AnonResourceType>
  apiRootPath?: string
  composition?: Array<RestResourceConfig<unknown, unknown, unknown>>
  stateName?: string
  apiPayloadResourceListName?: string
  verboseLogging?: boolean
}

export type RestClient<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  config: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
  reducer: RestReducer<CompositeIdentifierType, AnonResourceType>
  hook: RestHook<CompositeIdentifierType, AnonResourceType, ReadParamsType>
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

export type RestClientGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestClient<CompositeIdentifierType, AnonResourceType, ReadParamsType>

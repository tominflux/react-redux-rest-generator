import { R3gRequestController } from '../hooks/requestControllerHook/types'
import { R3gInitialStateGetter, R3gReducer } from './redux/types'

export type R3gResourceConfigParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  name: string
  identifiers: Array<keyof CompositeIdentifierType>
  primaryIdentifier: keyof CompositeIdentifierType
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
  composition?: Array<R3gResourceConfig<unknown, unknown, unknown>>
  stateName?: string
  apiPayloadResourceListName?: string
  verboseLogging?: boolean
}

export type R3gResourceConfig<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  name: string
  identifiers: Array<keyof CompositeIdentifierType>
  primaryIdentifier: keyof CompositeIdentifierType
  initialFields: AnonResourceType
  filter: (
    resource: AnonResourceType,
    params: ReadParamsType | Record<string, never>,
    index?: number
  ) => boolean
  sort: (
    resourceA: AnonResourceType,
    resourceB: AnonResourceType,
    params: ReadParamsType | Record<string, never>
  ) => number
  postProcess: (
    resourceList: Array<CompositeIdentifierType & AnonResourceType>,
    params: ReadParamsType | Record<string, never>
  ) => Array<CompositeIdentifierType & AnonResourceType>
  apiRootPath: string
  composition: Array<R3gResourceConfig<unknown, unknown, unknown>>
  stateName: string
  apiPayloadResourceListName: string
  verboseLogging: boolean
}

export type R3gClient<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  config: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
  reducer: R3gReducer<CompositeIdentifierType, AnonResourceType>
  useResourceScheduler: () => void
  useResource: () => R3gRequestController<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
  getInitialState: R3gInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

export type R3gClientGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => R3gClient<CompositeIdentifierType, AnonResourceType, ReadParamsType>

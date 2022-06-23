import { R3gRequestController } from '../hooks/requestControllerHook/types'
import { R3gInitialStateGetter, R3gReducer } from './redux/types'

/*********************************/
/*******  Data Structures  *******/
/*********************************/

// Data Structure: Resource configuration params
export type R3gResourceConfigParams<
  ResourceIdentifier,
  ResourceBody,
  ReadParams
> = {
  name: string
  identifiers: Array<keyof ResourceIdentifier>
  primaryIdentifier: keyof ResourceIdentifier
  initialFields: ResourceBody
  filter?: (
    resource: ResourceBody,
    params: ReadParams | Record<string, never>,
    index?: number
  ) => boolean
  sort?: (
    resourceA: ResourceBody,
    resourceB: ResourceBody,
    params: ReadParams | Record<string, never>
  ) => number
  postProcess?: (
    resourceList: Array<ResourceIdentifier & ResourceBody>,
    params: ReadParams | Record<string, never>
  ) => Array<ResourceIdentifier & ResourceBody>
  apiRootPath?: string
  composition?: Array<R3gResourceConfig<unknown, unknown, unknown>>
  stateName?: string
  apiPayloadResourceListName?: string
  verboseLogging?: boolean
}

// Data Structure: Resource configuration
export type R3gResourceConfig<ResourceIdentifier, ResourceBody, ReadParams> = {
  name: string
  identifiers: Array<keyof ResourceIdentifier>
  primaryIdentifier: keyof ResourceIdentifier
  propertyKeys: Array<keyof ResourceBody>
  initialFields: ResourceBody
  filter: (
    resource: ResourceBody,
    params: ReadParams | Record<string, never>,
    index?: number
  ) => boolean
  sort: (
    resourceA: ResourceBody,
    resourceB: ResourceBody,
    params: ReadParams | Record<string, never>
  ) => number
  postProcess: (
    resourceList: Array<ResourceIdentifier & ResourceBody>,
    params: ReadParams | Record<string, never>
  ) => Array<ResourceIdentifier & ResourceBody>
  apiRootPath: string
  composition: Array<R3gResourceConfig<unknown, unknown, unknown>>
  stateName: string
  apiPayloadResourceListName: string
  verboseLogging: boolean
}

// Data Structure: Resource client
export type R3gClient<ResourceIdentifier, ResourceBody, ReadParams> = {
  config: R3gResourceConfig<ResourceIdentifier, ResourceBody, ReadParams>
  reducer: R3gReducer<ResourceIdentifier, ResourceBody>
  useResourceScheduler: () => void
  useResource: () => R3gRequestController<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
  getInitialState: R3gInitialStateGetter<ResourceIdentifier, ResourceBody>
}

/*********************************/
/*********  Functions  ***********/
/*********************************/

// Function: Get resource configuration
export type R3gResourceConfigGetterParams<
  ResourceIdentifier,
  ResourceBody,
  ReadParams
> = {
  resourceConfigParams: R3gResourceConfigParams<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
}
export type R3gResourceConfigGetter = <
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  params: R3gResourceConfigGetterParams<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => R3gResourceConfig<ResourceIdentifier, ResourceBody, ReadParams>

// Function: Get R3G Client
export type R3gClientGetter = <ResourceIdentifier, ResourceBody, ReadParams>(
  resourceConfigParams: R3gResourceConfigParams<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => R3gClient<ResourceIdentifier, ResourceBody, ReadParams>

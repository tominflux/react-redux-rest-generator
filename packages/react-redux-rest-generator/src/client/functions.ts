import useRequestController from '../hooks/requestControllerHook'
import useRequestScheduler from '../hooks/requestSchedulerHook'
import R3gClientReduxFunctions from './redux/functions'
import {
  R3gClientGetter,
  R3gResourceConfigGetter,
  R3gResourceConfigGetterParams,
  R3gResourceConfig,
  R3gResourceConfigParams,
} from './types'

// Function: Get default resource configuration params
const getDefaultResourceConfigParams: R3gResourceConfigGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>({
  resourceConfigParams,
}: R3gResourceConfigGetterParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>) => {
  // Deconstruct: Optional resource configuration parameters
  const {
    filter: providedFilter,
    sort: providedSort,
    postProcess: providedPostProcess,
    apiRootPath: providedApiRootPath,
    composition: providedComposition,
    stateName: providedStateName,
    apiPayloadResourceListName: providedApiPayloadResourceListName,
    verboseLogging: providedVerboseLogging,
  } = resourceConfigParams

  // Deconstruct: Resource configuration parameters fpr
  //   deriving defaults
  const {
    name: resourceName,
    initialFields: resourceInitialFields,
  } = resourceConfigParams

  // Derive: Property keys from initial fields
  const propertyKeys = Object.keys(resourceInitialFields) as Array<
    keyof AnonResourceType
  >

  // Assign: Default configuration parameters where needed
  const filter = providedFilter ?? (() => true)
  const sort = providedSort ?? (() => 0)
  const postProcess =
    providedPostProcess ??
    ((resourceList: Array<CompositeIdentifierType & AnonResourceType>) =>
      resourceList)
  const apiRootPath = providedApiRootPath ?? '/api'
  const composition = providedComposition ?? []
  const stateName = providedStateName ?? `${resourceName}State`
  const apiPayloadResourceListName =
    providedApiPayloadResourceListName ?? `${resourceName}List`
  const verboseLogging = providedVerboseLogging ?? false

  // Construct: Resource configuration
  const resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  > = {
    ...resourceConfigParams,
    propertyKeys,
    filter,
    sort,
    postProcess,
    apiRootPath,
    composition,
    stateName,
    apiPayloadResourceListName,
    verboseLogging,
  }
  return resourceConfig
}

// Function: Get R3G Client
const getClient: R3gClientGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfigParams: R3gResourceConfigParams<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  // Derive: Resource configuration
  const resourceConfig = R3gClientFunctions.getDefaultResourceConfigParams<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >({ resourceConfigParams })

  // Derive: Client redux
  const clientRedux = R3gClientReduxFunctions.getClientRedux<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(resourceConfig)

  // Deconstruct: Client redux
  const { getInitialState, creators, reducer } = clientRedux

  // Contextualize: Scheduler hook
  const useResourceScheduler = () =>
    useRequestScheduler<
      CompositeIdentifierType,
      AnonResourceType,
      ReadParamsType
    >(resourceConfig, creators)

  // Contextualize: Controller hook
  const useResource = () =>
    useRequestController<
      CompositeIdentifierType,
      AnonResourceType,
      ReadParamsType
    >(creators, resourceConfig)

  return {
    config: resourceConfig,
    reducer,
    useResourceScheduler,
    useResource,
    getInitialState,
  }
}

const R3gClientFunctions = {
  getDefaultResourceConfigParams,
  getClient,
}

export default R3gClientFunctions

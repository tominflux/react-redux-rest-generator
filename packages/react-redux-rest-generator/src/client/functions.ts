import useRequestController from '../hooks/requestControllerHook'
import useRequestScheduler from '../hooks/requestSchedulerHook'
import R3gClientReduxFunctions from './redux/functions'
import { R3gClientGetter, R3gResourceConfig } from './types'

const getClient: R3gClientGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
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
  getClient,
}

export default R3gClientFunctions

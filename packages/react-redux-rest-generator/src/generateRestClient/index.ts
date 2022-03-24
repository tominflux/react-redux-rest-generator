import generateRequestSchedulerHook from './generateRequestSchedulerHook'
import generateRestControllerHook from './generateRestControllerHook'
import generateRestRedux from './generateRestRedux'
import { RestClientGenerator, RestResourceConfig } from './types'

/**
 * Generate a react-redux REST client for the described resource.
 */
const generateRestClient: RestClientGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  const { creators, reducer, getInitialState } = generateRestRedux<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(resourceConfig)

  const controllerHook = generateRestControllerHook<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(creators, resourceConfig)

  const schedulerHook = generateRequestSchedulerHook<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(creators, resourceConfig)

  const restClient = {
    config: resourceConfig,
    reducer,
    controllerHook,
    schedulerHook,
    getInitialState,
  }

  return restClient
}

export default generateRestClient

import { RestClientGenerator, RestResourceConfig } from '../types'
import generateRestHook from './generateRestHook'
import generateRestRedux from './generateRestRedux'

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

  const hook = generateRestHook<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(creators, resourceConfig)

  const restClient = {
    config: resourceConfig,
    reducer,
    hook,
    getInitialState,
  }

  return restClient
}

export default generateRestClient

import { RestClientGenerator, RestResourceConfig } from '../types'
import generateRestHook from './generateRestHook'
import generateRestRedux from './generateRestRedux'

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

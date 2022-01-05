import { RestResourceConfig } from '../types'
import generateInitialStateGetter from './generateInitialStateGetter'
import generateRestActions from './generateRestActions'
import generateRestCreators from './generateRestCreators'
import generateRestReducer from './generateRestReducer'
import { RestReduxGenerator } from './types'

const generateRestRedux: RestReduxGenerator = <
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
  const getInitialState = generateInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(resourceConfig)
  const actions = generateRestActions<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(resourceConfig)
  const creators = generateRestCreators<
    CompositeIdentifierType,
    AnonResourceType
  >(actions)
  const reducer = generateRestReducer<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >(getInitialState, actions, resourceConfig)

  return {
    actions,
    creators,
    reducer,
    getInitialState,
  }
}

export default generateRestRedux

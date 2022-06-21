import R3gActionFunctions from '../../redux/actions/functions'
import { R3gAction } from '../../redux/actions/types'
import R3gCreatorFunctions from '../../redux/creators/functions'
import InitialStateFunctions from '../../redux/initialState/functions'
import R3gReducerFunctions from '../../redux/reducer/functions'
import { R3gState } from '../../redux/types'
import { R3gResourceConfig } from '../types'
import { R3gInitialStateGetter, R3gReducer, R3gReduxGetter } from './types'

const getClientRedux: R3gReduxGetter = <
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
  // Deconstruct: Resource config
  const {
    name: resourceName,
    identifiers: resourceIdentifiers,
    initialFields: initialResourceFields,
  } = resourceConfig

  // Function: Typed initial state getter
  const getInitialState: R3gInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  > = () =>
    InitialStateFunctions.getInitialState<
      CompositeIdentifierType,
      AnonResourceType
    >({ initialFields: initialResourceFields })

  // Derive: Action key record
  const actions = R3gActionFunctions.getActionKeyRecord({
    resourceName,
  })

  // Derive: Creator record
  const creators = R3gCreatorFunctions.getR3gCreatorRecord<
    CompositeIdentifierType,
    AnonResourceType
  >({
    actionKeyRecord: actions,
  })

  // Function: Typed reducer
  const reducer: R3gReducer<CompositeIdentifierType, AnonResourceType> = (
    state: R3gState<CompositeIdentifierType, AnonResourceType>,
    action: R3gAction<CompositeIdentifierType, AnonResourceType>
  ) =>
    R3gReducerFunctions.reduceR3gState({
      state,
      action,
      actionKeyRecord: actions,
      resourceIdentifiers,
      initialResourceFields,
    })

  // Construct: Client redux
  return {
    getInitialState,
    actions,
    creators,
    reducer,
  }
}

const R3gClientReduxFunctions = {
  getClientRedux,
}

export default R3gClientReduxFunctions

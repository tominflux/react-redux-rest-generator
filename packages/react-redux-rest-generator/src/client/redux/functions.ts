import R3gActionFunctions from '../../redux/actions/functions'
import { R3gAction } from '../../redux/actions/types'
import R3gCreatorFunctions from '../../redux/creators/functions'
import R3gInitialStateFunctions from '../../redux/initialState/functions'
import R3gReducerFunctions from '../../redux/reducer/functions'
import { R3gState } from '../../redux/types'
import { R3gResourceConfig } from '../types'
import { R3gInitialStateGetter, R3gReducer, R3gReduxGetter } from './types'

const getClientRedux: R3gReduxGetter = <
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => {
  // Deconstruct: Resource config
  const {
    name: resourceName,
    identifiers: resourceIdentifiers,
    apiPayloadResourceListName: resourceListName,
    initialFields: initialResourceFields,
  } = resourceConfig

  // Function: Typed initial state getter
  const getInitialState: R3gInitialStateGetter<
    ResourceIdentifier,
    ResourceBody
  > = () =>
    R3gInitialStateFunctions.getInitialState<ResourceIdentifier, ResourceBody>({
      initialFields: initialResourceFields,
    })

  // Derive: Action key record
  const actions = R3gActionFunctions.getActionKeyRecord({
    resourceName,
  })

  // Derive: Creator record
  const creators = R3gCreatorFunctions.getR3gCreatorRecord<
    ResourceIdentifier,
    ResourceBody
  >({
    actionKeyRecord: actions,
  })

  // Function: Typed reducer
  const reducer: R3gReducer<ResourceIdentifier, ResourceBody> = (
    state: R3gState<ResourceIdentifier, ResourceBody>,
    action: R3gAction<ResourceIdentifier, ResourceBody>
  ) =>
    R3gReducerFunctions.reduceR3gState({
      state,
      action,
      actionKeyRecord: actions,
      resourceIdentifiers,
      resourceListName,
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

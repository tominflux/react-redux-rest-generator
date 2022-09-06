import R3gInitialStateFunctions from '../initialState/functions'
import reduceR3gStateCancelRequest from './functions/reduceR3gStateCancelRequest'
import reduceR3gStateClearFields from './functions/reduceR3gStateClearFields'
import reduceR3gStateClearResponse from './functions/reduceR3gStateClearResponse'
import reduceR3gStateFetch from './functions/reduceR3gStateFetch'
import reduceR3gStateInvalidate from './functions/reduceR3gStateInvalidate'
import reduceR3gStateQueueRequest from './functions/reduceR3gStateQueueRequest'
import reduceR3gStateResolve from './functions/reduceR3gStateResolve'
import reduceR3gStateResponse from './functions/reduceR3gStateResponse'
import reduceR3gStateSetField from './functions/reduceR3gStateSetField'
import { R3gGenericReducer, R3gGenericReducerParams } from './types'

// Reducer: Root
const reduceR3gState: R3gGenericReducer = <ResourceIdentifier, ResourceBody>({
  state,
  action,
  actionKeyRecord,
  resourceIdentifiers,
  resourceListName,
  initialResourceFields,
}: R3gGenericReducerParams<ResourceIdentifier, ResourceBody>) => {
  // Derive: Previous state (defaults to initial state)
  const prevState =
    state ??
    R3gInitialStateFunctions.getInitialState<ResourceIdentifier, ResourceBody>({
      initialFields: initialResourceFields,
    })

  // Switch: Action type
  switch (action.type) {
    // Case: Set field action
    case actionKeyRecord.setField: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateSetField<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    // Case: Queue request action
    case actionKeyRecord.queueRequest: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateQueueRequest<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    // Case: Cancel request action
    case actionKeyRecord.cancelRequest: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateCancelRequest<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    // Case: Fetch action
    case actionKeyRecord.fetch: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateFetch<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    // Case: Response action
    case actionKeyRecord.response: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateResponse<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
        resourceIdentifiers,
        resourceListName,
      })
    }
    // Case: Resolve action
    case actionKeyRecord.resolve: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateResolve<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    // Case: Invalidate action
    case actionKeyRecord.invalidate: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateInvalidate<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    // Case: Clear fields action
    case actionKeyRecord.clearFields: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateClearFields<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
        initialResourceFields,
      })
    }
    // Case: Clear response action
    case actionKeyRecord.clearResponse: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateClearResponse<ResourceIdentifier, ResourceBody>({
        state: prevState,
        payload,
      })
    }
    default:
      return prevState
  }
}

const R3gReducerFunctions = {
  reduceR3gState,
}

export default R3gReducerFunctions
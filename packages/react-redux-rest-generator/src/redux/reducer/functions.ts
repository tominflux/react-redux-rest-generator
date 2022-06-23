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
const reduceR3gState: R3gGenericReducer = <
  CompositeIdentifierType,
  AnonResourceType
>({
  state,
  action,
  actionKeyRecord,
  resourceIdentifiers,
  resourceListName,
  initialResourceFields,
}: R3gGenericReducerParams<CompositeIdentifierType, AnonResourceType>) => {
  // Derive: Previous state (defaults to initial state)
  const prevState =
    state ??
    R3gInitialStateFunctions.getInitialState<
      CompositeIdentifierType,
      AnonResourceType
    >({ initialFields: initialResourceFields })

  // Switch: Action type
  switch (action.type) {
    // Case: Set field action
    case actionKeyRecord.setField: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateSetField<CompositeIdentifierType, AnonResourceType>({
        state: prevState,
        payload,
      })
    }
    // Case: Queue request action
    case actionKeyRecord.queueRequest: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateQueueRequest<
        CompositeIdentifierType,
        AnonResourceType
      >({ state: prevState, payload })
    }
    // Case: Cancel request action
    case actionKeyRecord.cancelRequest: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateCancelRequest<
        CompositeIdentifierType,
        AnonResourceType
      >({ state: prevState, payload })
    }
    // Case: Fetch action
    case actionKeyRecord.fetch: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateFetch<CompositeIdentifierType, AnonResourceType>({
        state: prevState,
        payload,
      })
    }
    // Case: Response action
    case actionKeyRecord.response: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateResponse<CompositeIdentifierType, AnonResourceType>({
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
      return reduceR3gStateResolve<CompositeIdentifierType, AnonResourceType>({
        state: prevState,
        payload,
      })
    }
    // Case: Invalidate action
    case actionKeyRecord.invalidate: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateInvalidate<
        CompositeIdentifierType,
        AnonResourceType
      >({
        state: prevState,
        payload,
      })
    }
    // Case: Clear fields action
    case actionKeyRecord.clearFields: {
      // Deconstruct: Payload from action
      const { payload } = action

      // Return: Reduced state
      return reduceR3gStateClearFields<
        CompositeIdentifierType,
        AnonResourceType
      >({
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
      return reduceR3gStateClearResponse<
        CompositeIdentifierType,
        AnonResourceType
      >({
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

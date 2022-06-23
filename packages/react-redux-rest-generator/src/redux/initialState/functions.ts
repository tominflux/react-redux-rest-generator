import { R3gState } from '../types'
import {
  R3gGenericInitialStateGetter,
  R3gGenericInitialStateGetterParams,
} from './types'

const getInitialState: R3gGenericInitialStateGetter = <
  CompositeIdentifierType,
  AnonResourceType
>({
  initialFields,
}: R3gGenericInitialStateGetterParams<AnonResourceType>) => {
  const initialState: R3gState<CompositeIdentifierType, AnonResourceType> = {
    fields: initialFields,
    resourceList: [],
    pendingRequests: [],
    receivedResults: [],
    fetching: false,
    requestKey: null,
    hookKey: null,
    method: null,
    status: null,
    message: null,
    invalidationIndex: 0,
    compositeIdentifier: null,
  }
  return initialState
}

const R3gInitialStateFunctions = {
  getInitialState,
}

export default R3gInitialStateFunctions

import { R3gState } from '../types'
import {
  R3gGenericInitialStateGetter,
  R3gGenericInitialStateGetterParams,
} from './types'

const getInitialState: R3gGenericInitialStateGetter = <
  ResourceIdentifier,
  ResourceBody
>({
  initialFields,
}: R3gGenericInitialStateGetterParams<ResourceBody>) => {
  const initialState: R3gState<ResourceIdentifier, ResourceBody> = {
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
    resourceIdentifier: null,
  }
  return initialState
}

const R3gInitialStateFunctions = {
  getInitialState,
}

export default R3gInitialStateFunctions

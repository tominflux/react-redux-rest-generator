import {
  R3gGenericInitialStateGetter,
  R3gGenericInitialStateGetterParams,
} from './types'

const getInitialState: R3gGenericInitialStateGetter = <
  CompositeIdentifierType,
  AnonResourceType
>({
  initialFields,
}: R3gGenericInitialStateGetterParams<AnonResourceType>) => ({
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
})

const InitialStateFunctions = {
  getInitialState,
}

export default InitialStateFunctions

import { RestResourceConfig } from '../../types'
import { RestReduxInitialStateGetterGenerator } from './types'

const generateInitialStateGetter: RestReduxInitialStateGetterGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => () => ({
  fields: resourceConfig.initialFields,
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

export default generateInitialStateGetter

import {
  RestReduxInitialStateGetterGenerator,
  RestResourceConfig,
} from '../../types'

const generateInitialStateGetter: RestReduxInitialStateGetterGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => () => ({
  fields: resourceConfig.initialFields,
  resourceList: [] as Array<AnonResourceType>,
  pendingRequests: [],
  fetching: false,
  method: null,
  status: null,
  message: null,
  invalidationIndex: 0,
  compositeIdentifier: null as CompositeIdentifierType | null,
})

export default generateInitialStateGetter

/******************************/
/*********** CORE  ************/
/******************************/

type RestPrimitive = string | number | boolean | null

type RestReadParams = Record<string, RestPrimitive>

/******************************/
/********** CONFIG  ***********/
/******************************/

type RestResourceConfig<AnonResourceType, ReadParamsType> = {
  name: string
  identifiers: Array<string>
  primaryIdentifier: string
  initialFields: AnonResourceType
  filter?: (
    resource: AnonResourceType,
    params: ReadParamsType | Record<string, never>,
    index?: number
  ) => boolean
  sort?: (
    resourceA: AnonResourceType,
    resourceB: AnonResourceType,
    params: ReadParamsType | Record<string, never>
  ) => number
  postProcess?: (
    resourceList: Array<AnonResourceType>,
    params: ReadParamsType | Record<string, never>
  ) => Array<AnonResourceType>
  apiRootPath?: string
  composition?: Array<RestResourceConfig<unknown, unknown>>
  stateName?: string
  apiPayloadResourceListName?: string
  verboseLogging?: boolean
}

/******************************/
/************ API  ************/
/******************************/

type RestMethod = 'get' | 'post' | 'put' | 'delete'

type RestRequest = {
  key: string
  method: RestMethod
  url: string
  body: string
}

type RestApiPayload<CompositeIdentifierType, AnonResourceType> = {
  compositeIdentifier?: CompositeIdentifierType
  resourceList?: Array<AnonResourceType>
}
type RestManyApiUrlGetter = <AnonResourceType, ReadParamsType>(
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>,
  params?: ReadParamsType
) => string

type RestSingleApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  compositeIdentifier: CompositeIdentifierType,
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => string

type RestSingleAnonApiUrlGetter = <AnonResourceType, ReadParamsType>(
  parentsIdentifier: Record<string, string>,
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => string

/******************************/
/*********** REDUX ************/
/******************************/

type RestReduxActionKey =
  | 'SET_FIELD'
  | 'QUEUE_REQUEST'
  | 'CANCEL_REQUEST'
  | 'FETCH'
  | 'RESPONSE'
  | 'INVALIDATE'
  | 'CLEAR_FIELDS'
  | 'CLEAR_RESPONSE'

type RestReduxAction = {
  type: string
  payload: Record<string, unknown>
}

type RestReduxActionSet = Record<RestReduxActionKey, string>

type RestReduxActionsGenerator = <AnonResourceType, ReadParamsType>(
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => RestReduxActionSet

type RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType> = {
  setField: (
    name: keyof AnonResourceType,
    value: unknown
  ) => {
    type: string
    payload: {
      name: keyof AnonResourceType
      value: unknown
    }
  }
  queueRequest: (
    key: string,
    method: RestMethod,
    url: string,
    body: string | null
  ) => {
    type: string
    payload: {
      key: string
      method: string
      url: string
      body: string | null
    }
  }
  cancelRequest: (
    key: string
  ) => {
    type: string
    payload: {
      key: string
    }
  }
  fetch: (
    requestKey: string
  ) => {
    type: string
    payload: { requestKey: string }
  }
  response: (
    status: number,
    message: string,
    apiPayload: RestApiPayload<CompositeIdentifierType, AnonResourceType> | null
  ) => {
    type: string
    payload: {
      status: number
      message: string
      apiPayload: RestApiPayload<
        CompositeIdentifierType,
        AnonResourceType
      > | null
    }
  }
  invalidate: () => { type: string; payload: Record<string, never> }
  clearFields: () => { type: string; payload: Record<string, never> }
  clearResponse: () => { type: string; payload: Record<string, never> }
}

type RestReduxCreatorsGenerator = <CompositeIdentifierType, AnonResourceType>(
  actions: RestReduxActionSet
) => RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>

type RestReduxState<CompositeIdentifierType, AnonResourceType> = {
  fields: AnonResourceType
  resourceList: Array<AnonResourceType>
  pendingRequests: Array<RestRequest>
  fetching: boolean
  method: RestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  compositeIdentifier: CompositeIdentifierType | null
}

type RestReduxInitialStateGetter<
  CompositeIdentifierType,
  AnonResourceType
> = () => RestReduxState<CompositeIdentifierType, AnonResourceType>

type RestReduxInitialStateGetterGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => RestReduxInitialStateGetter<CompositeIdentifierType, AnonResourceType>

type RestReducer<CompositeIdentifierType, AnonResourceType> = (
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>,
  action: RestReduxAction
) => RestReduxState<CompositeIdentifierType, AnonResourceType>

type RestReducerGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >,
  actions: RestReduxActionSet,
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => RestReducer<CompositeIdentifierType, AnonResourceType>

type RestRedux<CompositeIdentifierType, AnonResourceType> = {
  actions: RestReduxActionSet
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>
  reducer: RestReducer<CompositeIdentifierType, AnonResourceType>
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

type RestReduxGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => RestRedux<CompositeIdentifierType, AnonResourceType>

/******************************/
/*********** HOOK  ************/
/******************************/

type RestCreateResult<CompositeIdentifierType> = {
  status: number
  message: string
  compositeIdentifier: CompositeIdentifierType | null
}
type RestReadResult<AnonResourceType> = {
  status: number
  message: string
  resourceList: Array<AnonResourceType>
}
type RestUpdateResult = {
  status: number
  message: string
}
type RestDeleteResult = {
  status: number
  message: string
}

type RestCreatePromiseResolver<CompositeIdentifierType> = {
  key: string
  resolve: (result: RestCreateResult<CompositeIdentifierType>) => void
  reject: (reason: string) => void
}
type RestReadPromiseResolver<AnonResourceType> = {
  key: string
  resolve: (result: RestReadResult<AnonResourceType>) => void
  reject: (reason: string) => void
}
type RestUpdatePromiseResolver = {
  key: string
  resolve: (result: RestUpdateResult) => void
  reject: (reason: string) => void
}
type RestDeletePromiseResolver = {
  key: string
  resolve: (result: RestDeleteResult) => void
  reject: (reason: string) => void
}

type RestInterface<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  // API
  fetching: boolean
  method: RestMethod | null
  status: number | null
  message: string | null
  clearResponse: () => void
  // CRUD
  create: (
    parentsIdentifier?: Record<string, string>
  ) => Promise<{
    status: number
    message: string
    compositeIdentifier: CompositeIdentifierType | null
  }>
  read: (
    params: ReadParamsType
  ) => Promise<{
    status: number
    message: string
    resourceList: Array<AnonResourceType>
  }>
  update: (
    compositeIdentifier: CompositeIdentifierType,
    overrideData?: AnonResourceType
  ) => Promise<{ status: number; message: string }>
  delete: (
    compositeIdentifier: CompositeIdentifierType
  ) => Promise<{ status: number; message: string }>
  // Form
  getField: (name: keyof AnonResourceType) => unknown
  setField: (
    name: keyof AnonResourceType,
    value: string | number | boolean | null
  ) => void
  clearFields: () => void
  // Cache
  getMany: (params?: ReadParamsType) => Array<AnonResourceType>
  getOne: (
    compositeIdentifier: CompositeIdentifierType
  ) => AnonResourceType | null
  invalidate: () => void
}

type RestInterfaceGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>,
  dispatch: (action: { type: string; payload: unknown }) => void,
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>,
  putCreatePromiseResolver: (
    resolver: RestCreatePromiseResolver<CompositeIdentifierType>
  ) => void,
  putReadPromiseResolver: (
    resolver: RestReadPromiseResolver<AnonResourceType>
  ) => void,
  putUpdatePromiseResolver: (resolver: RestUpdatePromiseResolver) => void,
  putDeletePromiseResolver: (resolver: RestDeletePromiseResolver) => void
) => RestInterface<CompositeIdentifierType, AnonResourceType, ReadParamsType>

type RestHook<CompositeIdentifierType, AnonResourceType, ReadParamsType> = (
  paramsList?: Array<ReadParamsType>,
  readExplicitly?: boolean
) => RestInterface<CompositeIdentifierType, AnonResourceType, ReadParamsType>

type RestHookGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => RestHook<CompositeIdentifierType, AnonResourceType, ReadParamsType>

/******************************/
/******** REST CLIENT *********/
/******************************/

type RestClient<CompositeIdentifierType, AnonResourceType, ReadParamsType> = {
  config: RestResourceConfig<AnonResourceType, ReadParamsType>
  reducer: RestReducer<CompositeIdentifierType, AnonResourceType>
  hook: RestHook<CompositeIdentifierType, AnonResourceType, ReadParamsType>
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

type RestClientGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => RestClient<CompositeIdentifierType, AnonResourceType, ReadParamsType>

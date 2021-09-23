/******************************/
/*********** CORE  ************/
/******************************/

export type RestPrimitive = string | number | boolean | null

export type RestReadParams = Record<string, RestPrimitive>

/******************************/
/********** CONFIG  ***********/
/******************************/

export type RestResourceConfig<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
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
    resourceList: Array<CompositeIdentifierType & AnonResourceType>,
    params: ReadParamsType | Record<string, never>
  ) => Array<CompositeIdentifierType & AnonResourceType>
  apiRootPath?: string
  composition?: Array<RestResourceConfig<unknown, unknown, unknown>>
  stateName?: string
  apiPayloadResourceListName?: string
  verboseLogging?: boolean
}

/******************************/
/************ API  ************/
/******************************/

export type RestMethod = 'get' | 'post' | 'put' | 'delete'

export type RestRequest = {
  key: string
  method: RestMethod
  url: string
  body: string
}

export type RestApiPayload<CompositeIdentifierType, AnonResourceType> = {
  compositeIdentifier?: CompositeIdentifierType
  resourceList?: Array<CompositeIdentifierType & AnonResourceType>
}
export type RestManyApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  params?: ReadParamsType
) => string

export type RestSingleApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  compositeIdentifier: CompositeIdentifierType,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string

export type RestSingleAnonApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  parentsIdentifier: Record<string, string>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string

/******************************/
/*********** REDUX ************/
/******************************/

export type RestReduxActionKey =
  | 'SET_FIELD'
  | 'QUEUE_REQUEST'
  | 'CANCEL_REQUEST'
  | 'FETCH'
  | 'RESPONSE'
  | 'INVALIDATE'
  | 'CLEAR_FIELDS'
  | 'CLEAR_RESPONSE'

export type RestReduxAction = {
  type: string
  payload: Record<string, unknown>
}

export type RestReduxActionSet = Record<RestReduxActionKey, string>

export type RestReduxActionsGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestReduxActionSet

export type RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType> = {
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

export type RestReduxCreatorsGenerator = <
  CompositeIdentifierType,
  AnonResourceType
>(
  actions: RestReduxActionSet
) => RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>

export type RestReduxState<CompositeIdentifierType, AnonResourceType> = {
  fields: AnonResourceType
  resourceList: Array<CompositeIdentifierType & AnonResourceType>
  pendingRequests: Array<RestRequest>
  fetching: boolean
  method: RestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  compositeIdentifier: CompositeIdentifierType | null
}

export type RestReduxInitialStateGetter<
  CompositeIdentifierType,
  AnonResourceType
> = () => RestReduxState<CompositeIdentifierType, AnonResourceType>

export type RestReduxInitialStateGetterGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestReduxInitialStateGetter<CompositeIdentifierType, AnonResourceType>

export type RestReducer<CompositeIdentifierType, AnonResourceType> = (
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>,
  action: RestReduxAction
) => RestReduxState<CompositeIdentifierType, AnonResourceType>

export type RestReducerGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >,
  actions: RestReduxActionSet,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestReducer<CompositeIdentifierType, AnonResourceType>

export type RestRedux<CompositeIdentifierType, AnonResourceType> = {
  actions: RestReduxActionSet
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>
  reducer: RestReducer<CompositeIdentifierType, AnonResourceType>
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

export type RestReduxGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestRedux<CompositeIdentifierType, AnonResourceType>

/******************************/
/*********** HOOK  ************/
/******************************/

export type RestCreateResult<CompositeIdentifierType> = {
  status: number
  message: string
  compositeIdentifier: CompositeIdentifierType | null
}
export type RestReadResult<CompositeIdentifierType, AnonResourceType> = {
  status: number
  message: string
  resourceList: Array<CompositeIdentifierType & AnonResourceType>
}
export type RestUpdateResult = {
  status: number
  message: string
}
export type RestDeleteResult = {
  status: number
  message: string
}

export type RestCreatePromiseResolver<CompositeIdentifierType> = {
  key: string
  resolve: (result: RestCreateResult<CompositeIdentifierType>) => void
  reject: (reason: string) => void
}
export type RestReadPromiseResolver<
  CompositeIdentifierType,
  AnonResourceType
> = {
  key: string
  resolve: (
    result: RestReadResult<CompositeIdentifierType, AnonResourceType>
  ) => void
  reject: (reason: string) => void
}
export type RestUpdatePromiseResolver = {
  key: string
  resolve: (result: RestUpdateResult) => void
  reject: (reason: string) => void
}
export type RestDeletePromiseResolver = {
  key: string
  resolve: (result: RestDeleteResult) => void
  reject: (reason: string) => void
}

export type RestInterface<
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
  ) => Promise<RestCreateResult<CompositeIdentifierType>>
  read: (
    params: ReadParamsType
  ) => Promise<RestReadResult<CompositeIdentifierType, AnonResourceType>>
  update: (
    compositeIdentifier: CompositeIdentifierType,
    overrideData?: AnonResourceType
  ) => Promise<RestUpdateResult>
  delete: (
    compositeIdentifier: CompositeIdentifierType
  ) => Promise<RestDeleteResult>
  // Form
  getField: (name: keyof AnonResourceType) => unknown
  setField: (name: keyof AnonResourceType, value: unknown) => void
  clearFields: () => void
  // Cache
  getMany: (
    params?: ReadParamsType
  ) => Array<CompositeIdentifierType & AnonResourceType>
  getOne: (
    compositeIdentifier: CompositeIdentifierType
  ) => (CompositeIdentifierType & AnonResourceType) | null
  invalidate: () => void
}

export type RestInterfaceGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>,
  dispatch: (action: { type: string; payload: unknown }) => void,
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  putCreatePromiseResolver: (
    resolver: RestCreatePromiseResolver<CompositeIdentifierType>
  ) => void,
  putReadPromiseResolver: (
    resolver: RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  ) => void,
  putUpdatePromiseResolver: (resolver: RestUpdatePromiseResolver) => void,
  putDeletePromiseResolver: (resolver: RestDeletePromiseResolver) => void
) => RestInterface<CompositeIdentifierType, AnonResourceType, ReadParamsType>

export type RestHook<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = (
  paramsList?: Array<ReadParamsType>,
  readExplicitly?: boolean
) => RestInterface<CompositeIdentifierType, AnonResourceType, ReadParamsType>

export type RestHookGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestHook<CompositeIdentifierType, AnonResourceType, ReadParamsType>

/******************************/
/******** REST CLIENT *********/
/******************************/

export type RestClient<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  config: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
  reducer: RestReducer<CompositeIdentifierType, AnonResourceType>
  hook: RestHook<CompositeIdentifierType, AnonResourceType, ReadParamsType>
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

export type RestClientGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestClient<CompositeIdentifierType, AnonResourceType, ReadParamsType>

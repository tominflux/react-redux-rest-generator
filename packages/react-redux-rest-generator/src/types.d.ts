// Core

type RestResourceConfig = {
  name: string
  identifiers: Array<string>
  primaryIdentifier: string
  initialFields: Record<string, unknown>
  filter?: (
    resource: Record<string, unknown>,
    params: RestReadParams,
    index?: number
  ) => boolean
  sort?: (
    resourceA: Record<string, unknown>,
    resourceB: Record<string, unknown>,
    params: RestReadParams
  ) => number
  postProcess?: (
    resourceList: Array<Record<string, unknown>>,
    params: RestReadParams
  ) => Array<Record<string, unknown>>
  apiRootPath?: string // /api
  composition?: Array<RestResourceConfig>
  stateName?: string
  apiPayloadResourceListName?: string
}

type RestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'
type RestReadParam =
  | string
  | number
  | boolean
  | Array<string | number | boolean>
type RestReadParams = Record<string, RestReadParam>

// Redux

type RestReduxActionIdentifier =
  | 'SET_FIELD'
  | 'QUEUE_REQUEST'
  | 'FETCH'
  | 'RESPONSE'
  | 'INVALIDATE'
  | 'CLEAR_FIELDS'
  | 'CLEAR_RESPONSE'

type RestReduxActionSet = Record<RestReduxActionIdentifier, string>

type R3GApiPayload = {
  compositeIdentifier?: Record<string, string>
  resourceList?: Array<Record<string, unknown>>
}

type RestReduxCreatorSet = {
  setField: (
    name: string,
    value: unknown
  ) => {
    type: string
    payload: {
      name: string
      value: unknown
    }
  }
  queueRequest: (
    method: string,
    url: string,
    body: string
  ) => {
    type: string
    payload: {
      method: string
      url: string
      body: string
    }
  }
  fetch: () => {
    type: string
    payload: Record<string, never>
  }
  response: (
    status: number,
    message: string,
    apiPayload: R3GApiPayload | null
  ) => {
    type: string
    payload: {
      status: number
      message: string
      apiPayload: R3GApiPayload | null
    }
  }
  invalidate: () => { type: string; payload: Record<string, never> }
  clearFields: () => { type: string; payload: Record<string, never> }
  clearResponse: () => { type: string; payload: Record<string, never> }
}

type RestReduxAction = {
  type: string
  payload: Record<string, unknown>
}

type RestRequest = {
  method: string
  url: string
  body: string
}

type RestReduxState = {
  fields: Record<string, unknown>
  resourceList: Array<Record<string, unknown>>
  pendingRequests: Array<RestRequest>
  fetching: boolean
  method: RestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  compositeIdentifier: Record<string, string> | null
}

type RestReducer = (
  state: RestReduxState,
  action: RestReduxAction
) => RestReduxState

// Hook

type RestInterface = {
  fetching: boolean
  method: RestMethod | null
  status: number | null
  message: string | null
  create: (
    parentsIdentifier?: Record<string, string>
  ) => Promise<{
    status: number
    message: string
    compositeIdentifier: Record<string, unknown> | null
  }>
  read: (
    params: RestReadParams
  ) => Promise<{
    status: number
    message: string
    resourceList: Array<Record<string, unknown>>
  }>
  update: (
    compositeIdentifier: Record<string, string>
  ) => Promise<{ status: number; message: string }>
  delete: (
    compositeIdentifier: Record<string, string>
  ) => Promise<{ status: number; message: string }>
  getField: (name: string) => unknown
  setField: (name: string, value: unknown) => void
  clearFields: () => void
  clearResponse: () => void
  getMany: (params?: RestReadParams) => Array<Record<string, unknown>>
  getOne: (
    compositeIdentifier: Record<string, string>
  ) => Record<string, unknown> | null
  invalidate: () => void
}

type RestHook = (
  paramsList?: Array<RestReadParams>,
  readExplicitly?: boolean
) => RestInterface

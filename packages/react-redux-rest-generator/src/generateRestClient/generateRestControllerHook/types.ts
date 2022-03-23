import { Dispatch } from 'redux'
import { RestReduxCreatorSet } from '../generateRestRedux/generateRestCreators/types'
import { RestReduxState } from '../generateRestRedux/types'
import { RestResourceConfig } from '../types'
import { RestInterface } from './generateRestInterface/types'

export type RestAmbiguousResult = {
  status: number
  message: string
  payload: unknown
}
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

export type RestAmbiguousPromiseResolver<
  CompositeIdentifierType,
  AnonResourceType
> =
  | RestCreatePromiseResolver<CompositeIdentifierType>
  | RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  | RestUpdatePromiseResolver
  | RestDeletePromiseResolver
export type RestCreatePromiseResolver<CompositeIdentifierType> = {
  requestKey: string
  resolve: (result: RestCreateResult<CompositeIdentifierType>) => void
  reject: (reason: string) => void
}
export type RestReadPromiseResolver<
  CompositeIdentifierType,
  AnonResourceType
> = {
  requestKey: string
  resolve: (
    result: RestReadResult<CompositeIdentifierType, AnonResourceType>
  ) => void
  reject: (reason: string) => void
}
export type RestUpdatePromiseResolver = {
  requestKey: string
  resolve: (result: RestUpdateResult) => void
  reject: (reason: string) => void
}
export type RestDeletePromiseResolver = {
  requestKey: string
  resolve: (result: RestDeleteResult) => void
  reject: (reason: string) => void
}

export type RestControllerHookContext<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  // Config
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
  // Hook Details
  hookKey: string
  // Redux
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>
  dispatch: Dispatch
  // Promise Resolver Lists
  createPromiseResolverList: Array<
    RestCreatePromiseResolver<CompositeIdentifierType>
  >
  readPromiseResolverList: Array<
    RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  >
  updatePromiseResolverList: Array<RestUpdatePromiseResolver>
  deletePromiseResolverList: Array<RestDeletePromiseResolver>
  // Promise Resolver Actions
  // - Create
  putCreatePromiseResolver: (
    resolver: RestCreatePromiseResolver<CompositeIdentifierType>
  ) => void
  takeCreatePromiseResolver: (
    key: string
  ) => RestCreatePromiseResolver<CompositeIdentifierType>
  // - Read
  putReadPromiseResolver: (
    resolver: RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  ) => void
  takeReadPromiseResolver: (
    key: string
  ) => RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  // - Update
  putUpdatePromiseResolver: (resolver: RestUpdatePromiseResolver) => void
  takeUpdatePromiseResolver: (key: string) => RestUpdatePromiseResolver
  // - Delete
  putDeletePromiseResolver: (resolver: RestDeletePromiseResolver) => void
  takeDeletePromiseResolver: (key: string) => RestDeletePromiseResolver
}

export type RestControllerHook<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = () => RestInterface<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>

export type RestControllerHookGenerator = <
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
) => RestControllerHook<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>

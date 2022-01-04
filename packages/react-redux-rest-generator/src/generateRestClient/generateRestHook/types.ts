import { Dispatch } from 'redux'
import {
  RestCreatePromiseResolver,
  RestDeletePromiseResolver,
  RestReadPromiseResolver,
  RestReduxCreatorSet,
  RestReduxState,
  RestResourceConfig,
  RestUpdatePromiseResolver,
} from '../../types'

export type RestHookContext<
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

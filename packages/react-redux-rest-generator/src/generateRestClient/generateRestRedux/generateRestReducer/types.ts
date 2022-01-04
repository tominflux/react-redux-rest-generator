import { RestResourceConfig } from '../../../types'
import {
  RestReduxAction,
  RestReduxActionSet,
} from '../generateRestActions/types'
import { RestReduxState } from '../types'

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

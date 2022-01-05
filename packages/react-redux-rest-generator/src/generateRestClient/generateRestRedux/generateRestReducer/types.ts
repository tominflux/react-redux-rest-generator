import { RestResourceConfig } from '../../types'
import { RestReduxInitialStateGetter } from '../generateInitialStateGetter/types'
import {
  RestReduxAction,
  RestReduxActionSet,
} from '../generateRestActions/types'
import { RestReduxState } from '../types'

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

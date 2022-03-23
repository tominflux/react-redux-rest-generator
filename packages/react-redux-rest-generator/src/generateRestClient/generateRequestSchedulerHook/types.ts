import { Dispatch } from 'redux'
import { RestReduxCreatorSet } from '../generateRestRedux/generateRestCreators/types'
import { RestReduxState } from '../generateRestRedux/types'
import { RestResourceConfig } from '../types'

export type RestSchedulerHookContext<
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
  // Redux
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>
  dispatch: Dispatch
}

export type RestSchedulerHook = () => void

export type RestSchedulerHookGenerator = <
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
) => RestSchedulerHook

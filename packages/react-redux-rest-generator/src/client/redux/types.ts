import { R3gState } from '../../redux/types'
import { R3gAction, R3gActionKeyRecord } from '../../redux/actions/types'
import { R3gCreatorRecord } from '../../redux/creators/types'
import { R3gResourceConfig } from '../types'

export type R3gRedux<CompositeIdentifierType, AnonResourceType> = {
  getInitialState: R3gInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
  actions: R3gActionKeyRecord
  creators: R3gCreatorRecord<CompositeIdentifierType, AnonResourceType>
  reducer: R3gReducer<CompositeIdentifierType, AnonResourceType>
}

///

// Function: Initial State Getter
export type R3gInitialStateGetter<
  CompositeIdentifierType,
  AnonResourceType
> = () => R3gState<CompositeIdentifierType, AnonResourceType>

// Function: Reducer
export type R3gReducer<CompositeIdentifierType, AnonResourceType> = (
  state: R3gState<CompositeIdentifierType, AnonResourceType>,
  action: R3gAction<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Function: Redux
export type R3gReduxGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => R3gRedux<CompositeIdentifierType, AnonResourceType>

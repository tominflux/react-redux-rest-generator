import { R3gState } from '../../redux/types'
import { R3gAction, R3gActionKeyRecord } from '../../redux/actions/types'
import { R3gCreatorRecord } from '../../redux/creators/types'
import { R3gResourceConfig } from '../types'

export type R3gRedux<ResourceIdentifier, ResourceBody> = {
  getInitialState: R3gInitialStateGetter<ResourceIdentifier, ResourceBody>
  actions: R3gActionKeyRecord
  creators: R3gCreatorRecord<ResourceIdentifier, ResourceBody>
  reducer: R3gReducer<ResourceIdentifier, ResourceBody>
}

///

// Function: Initial State Getter
export type R3gInitialStateGetter<
  ResourceIdentifier,
  ResourceBody
> = () => R3gState<ResourceIdentifier, ResourceBody>

// Function: Reducer
export type R3gReducer<ResourceIdentifier, ResourceBody> = (
  state: R3gState<ResourceIdentifier, ResourceBody>,
  action: R3gAction<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Function: Redux
export type R3gReduxGetter = <ResourceIdentifier, ResourceBody, ReadParams>(
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => R3gRedux<ResourceIdentifier, ResourceBody>

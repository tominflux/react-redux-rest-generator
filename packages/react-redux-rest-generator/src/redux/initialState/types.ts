import { R3gState } from '../types'

export type R3gGenericInitialStateGetterParams<ResourceBody> = {
  initialFields: ResourceBody
}
export type R3gGenericInitialStateGetter = <ResourceIdentifier, ResourceBody>(
  params: R3gGenericInitialStateGetterParams<ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

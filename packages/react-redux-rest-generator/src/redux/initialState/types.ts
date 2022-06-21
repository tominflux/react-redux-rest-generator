import { R3gState } from '../types'

export type R3gGenericInitialStateGetterParams<AnonResourceType> = {
  initialFields: AnonResourceType
}
export type R3gGenericInitialStateGetter = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: R3gGenericInitialStateGetterParams<AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

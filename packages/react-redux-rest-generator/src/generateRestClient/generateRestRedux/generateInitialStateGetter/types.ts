import { RestResourceConfig } from '../../types'
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

import { RestHookContext } from '../../types'

type RestHookDismountHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => void

export default RestHookDismountHandler

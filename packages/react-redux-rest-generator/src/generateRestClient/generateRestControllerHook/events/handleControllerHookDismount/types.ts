import { RestControllerHookContext } from '../../types'

type RestHookDismountHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => void

export default RestHookDismountHandler

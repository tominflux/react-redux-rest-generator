import { RestControllerHookContext } from '../../types'

type RestProcessRequestEventHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => Promise<void>

export default RestProcessRequestEventHandler

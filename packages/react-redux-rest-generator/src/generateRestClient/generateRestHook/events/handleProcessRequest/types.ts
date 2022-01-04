import { RestHookContext } from '../../types'

type RestProcessRequestEventHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => Promise<void>

export default RestProcessRequestEventHandler

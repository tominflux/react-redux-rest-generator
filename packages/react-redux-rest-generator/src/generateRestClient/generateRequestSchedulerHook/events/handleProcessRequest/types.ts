import { RestSchedulerHookContext } from '../../types'

type RestProcessRequestEventHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  schedulerHookContext: RestSchedulerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => Promise<void>

export default RestProcessRequestEventHandler

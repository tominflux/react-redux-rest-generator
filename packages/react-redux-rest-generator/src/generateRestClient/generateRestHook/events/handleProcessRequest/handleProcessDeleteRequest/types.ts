import {
  RestDeletePromiseResolver,
  RestDeleteResult,
  RestRequest,
} from '../../../../../types'
import { RestHookContext } from '../../../types'

type RestProcessDeleteRequestEventHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  request: RestRequest,
  result: RestDeleteResult,
  resolver: RestDeletePromiseResolver
) => Promise<void>

export default RestProcessDeleteRequestEventHandler

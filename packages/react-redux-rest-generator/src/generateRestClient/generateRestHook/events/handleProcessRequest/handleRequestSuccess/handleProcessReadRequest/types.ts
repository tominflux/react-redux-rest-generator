import {
  RestRequest,
  RestReadResult,
  RestReadPromiseResolver,
} from '../../../../../../types'
import { RestHookContext } from '../../../../types'

type RestProcessReadRequestEventHandler = <
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
  result: RestReadResult<CompositeIdentifierType, AnonResourceType>,
  resolver: RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
) => Promise<void>

export default RestProcessReadRequestEventHandler

import {
  RestReadPromiseResolver,
  RestReadResult,
  RestRequest,
} from '../../../../../types'
import { RestHookContext } from '../../../types'

type RestProcessReadErrorEventHandler = <
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

export default RestProcessReadErrorEventHandler

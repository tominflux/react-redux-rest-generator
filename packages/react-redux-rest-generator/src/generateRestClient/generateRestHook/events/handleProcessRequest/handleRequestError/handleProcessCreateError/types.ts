import {
  RestCreatePromiseResolver,
  RestCreateResult,
  RestRequest,
} from '../../../../../../types'
import { RestHookContext } from '../../../../types'

type RestProcessCreateErrorEventHandler = <
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
  result: RestCreateResult<CompositeIdentifierType>,
  resolver: RestCreatePromiseResolver<CompositeIdentifierType>
) => Promise<void>

export default RestProcessCreateErrorEventHandler

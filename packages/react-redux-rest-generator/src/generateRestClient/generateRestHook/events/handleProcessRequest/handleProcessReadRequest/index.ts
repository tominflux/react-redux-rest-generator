import {
  RestReadPromiseResolver,
  RestReadResult,
  RestRequest,
} from '../../../../../types'
import { RestHookContext } from '../../../types'
import RestProcessReadRequestEventHandler from './types'

const handleProcessReadRequest: RestProcessReadRequestEventHandler = async <
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
) => {
  // Deconstruct context
  const { resourceConfig, hookKey, creators, dispatch } = hookContext

  // Deconstruct request
  const { key } = request

  // Deconstruct result
  const { status, message, resourceList } = result

  // Inform reducer of read response
  const responseAction = creators.response(key, status, message, {
    resourceList: resourceList as Array<
      CompositeIdentifierType & AnonResourceType
    >,
  })
  dispatch(responseAction)

  // Resolve promise
  resolver.resolve({
    status,
    message,
    resourceList,
  })

  if (resourceConfig.verboseLogging)
    console.log(
      `R3G - ${resourceConfig.name} - Request Resolved | `,
      'Success',
      {
        hook: hookKey,
        ...request,
      }
    )
}

export default handleProcessReadRequest

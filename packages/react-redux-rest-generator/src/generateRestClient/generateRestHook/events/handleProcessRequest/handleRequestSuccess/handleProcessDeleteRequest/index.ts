import {
  RestDeletePromiseResolver,
  RestDeleteResult,
  RestRequest,
} from '../../../../../types'
import { RestHookContext } from '../../../types'
import RestProcessDeleteRequestEventHandler from './types'

const handleProcessDeleteRequest: RestProcessDeleteRequestEventHandler = async <
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
) => {
  // Deconstruct Context
  const { resourceConfig, hookKey, creators, dispatch } = hookContext

  // Deconstruct request
  const { key } = request

  // Deconstruct result
  const { status, message } = result

  // Inform reducer of Delete response
  const responseAction = creators.response(key, status, message, null)
  dispatch(responseAction)

  // Resolve promise
  resolver.resolve({
    status,
    message,
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

export default handleProcessDeleteRequest

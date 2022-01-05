import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestUpdateResult,
  RestUpdatePromiseResolver,
  RestControllerHookContext,
} from '../../../../types'
import RestProcessUpdateRequestEventHandler from './types'

const handleProcessUpdateRequest: RestProcessUpdateRequestEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  request: RestRequest,
  result: RestUpdateResult,
  resolver: RestUpdatePromiseResolver
) => {
  // Deconstruct Context
  const { resourceConfig, hookKey, creators, dispatch } = hookContext

  // Deconstruct request
  const { requestKey } = request

  // Deconstruct result
  const { status, message } = result

  // Inform reducer of Update response
  const responseAction = creators.response(
    requestKey,
    hookKey,
    status,
    message,
    null
  )
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

export default handleProcessUpdateRequest

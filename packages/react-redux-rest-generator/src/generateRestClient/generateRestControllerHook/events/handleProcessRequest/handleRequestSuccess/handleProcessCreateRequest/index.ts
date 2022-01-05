import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestCreateResult,
  RestCreatePromiseResolver,
  RestControllerHookContext,
} from '../../../../types'
import RestProcessCreateRequestEventHandler from './types'

const handleProcessCreateRequest: RestProcessCreateRequestEventHandler = async <
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
  result: RestCreateResult<CompositeIdentifierType>,
  resolver: RestCreatePromiseResolver<CompositeIdentifierType>
) => {
  // Deconstruct Context
  const { resourceConfig, hookKey, creators, dispatch } = hookContext

  // Deconstruct request
  const { requestKey } = request

  // Deconstruct result
  const { status, message, compositeIdentifier } = result

  // Inform reducer of create response
  const responseAction = creators.response(
    requestKey,
    hookKey,
    status,
    message,
    {
      compositeIdentifier: compositeIdentifier as CompositeIdentifierType,
    }
  )
  dispatch(responseAction)

  // Resolve promise
  resolver.resolve({
    status,
    message,
    compositeIdentifier,
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

export default handleProcessCreateRequest

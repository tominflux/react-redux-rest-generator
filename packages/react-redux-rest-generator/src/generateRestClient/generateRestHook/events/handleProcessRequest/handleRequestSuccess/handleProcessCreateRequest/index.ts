import {
  RestCreatePromiseResolver,
  RestCreateResult,
  RestRequest,
} from '../../../../../../types'
import { RestHookContext } from '../../../../types'
import RestProcessCreateRequestEventHandler from './types'

const handleProcessCreateRequest: RestProcessCreateRequestEventHandler = async <
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
) => {
  // Deconstruct Context
  const { resourceConfig, hookKey, creators, dispatch } = hookContext

  // Deconstruct request
  const { key } = request

  // Deconstruct result
  const { status, message, compositeIdentifier } = result

  // Inform reducer of create response
  const responseAction = creators.response(key, status, message, {
    compositeIdentifier: compositeIdentifier as CompositeIdentifierType,
  })
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

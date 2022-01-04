import {
  RestRequest,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../../../../../types'
import { RestHookContext } from '../../../../types'
import RestProcessUpdateErrorEventHandler from './types'

const handleProcessUpdateError: RestProcessUpdateErrorEventHandler = async <
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
  result: RestUpdateResult,
  resolver: RestUpdatePromiseResolver
) => {
  // Deconstruct Context
  const { resourceConfig, hookKey, creators, dispatch } = hookContext

  // Deconstruct request
  const { key } = request

  // Deconstruct result
  const { status, message } = result

  // Inform reducer that update/delete operation failed
  const responseAction = creators.response(key, status, message, {})
  dispatch(responseAction)

  // Resolve promise
  resolver.resolve(result)
  if (resourceConfig.verboseLogging)
    console.log(`R3G - ${resourceConfig.name} - Request Resolved | `, 'Error', {
      hook: hookKey,
      ...request,
    })
}

export default handleProcessUpdateError

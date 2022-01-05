import { RestControllerHookContext } from '../../types'
import RestHookDismountHandler from './types'

const handleDismount: RestHookDismountHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  const {
    resourceConfig,
    creators,
    hookKey,
    createPromiseResolverList,
    readPromiseResolverList,
    updatePromiseResolverList,
    deletePromiseResolverList,
    dispatch,
  } = hookContext

  // Report dismount
  if (resourceConfig.verboseLogging) {
    console.log(`R3G - ${resourceConfig.name} - Hook dismounting`, {
      hook: hookKey,
    })
  }

  // Reject promise resolvers
  const resolverList = [
    ...createPromiseResolverList,
    ...readPromiseResolverList,
    ...updatePromiseResolverList,
    ...deletePromiseResolverList,
  ]
  resolverList.forEach((resolver) => {
    const { key: requestKey, reject } = resolver
    reject(
      `R3G - ${resourceConfig.name} - Hook ${hookKey} dismounted before request ${requestKey} could be handled.`
    )
  })

  // Remove requests from queue
  const requestKeyList = resolverList.map((resolver) => resolver.key)
  requestKeyList.forEach((requestKey) => {
    const cancelAction = creators.cancelRequest(requestKey)
    dispatch(cancelAction)
  })
}

export default handleDismount

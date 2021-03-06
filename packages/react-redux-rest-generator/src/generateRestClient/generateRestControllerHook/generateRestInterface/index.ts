import generateUuid from '../../../utils/generateUuid'
import {
  RestControllerHookContext,
  RestCreatePromiseResolver,
  RestCreateResult,
  RestDeletePromiseResolver,
  RestDeleteResult,
  RestReadPromiseResolver,
  RestReadResult,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../generateRestControllerHook/types'
import getApiUrlMany from './getApiUrl/getApiUrlMany'
import getApiUrlSingle from './getApiUrl/getApiUrlSingle'
import getApiUrlSingleAnon from './getApiUrl/getApiUrlSingleAnon'
import { RestInterfaceGenerator } from './types'

const generateRestInterface: RestInterfaceGenerator = <
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
  // Deconstruct context
  const {
    hookKey,
    state,
    dispatch,
    creators,
    resourceConfig,
    putCreatePromiseResolver,
    putReadPromiseResolver,
    putUpdatePromiseResolver,
    putDeletePromiseResolver,
  } = hookContext

  // Error Checks
  // - Ensure REST-redux state is not nullish
  if ((state ?? null) === null) {
    throw new Error(`State of ${resourceConfig.name} is nullish.`)
  }

  // Compose interface
  const _interface = {
    fetching: state.fetching,
    method: state.method,
    status: state.status,
    message: state.message,
    create: async (
      parentsIdentifier?: Record<string, string>,
      overrideData?: AnonResourceType
    ) => {
      // Ensure parentsIdentifier supplied if needed
      if (resourceConfig.identifiers.length > 1 && !parentsIdentifier) {
        throw new Error(
          `Expected parents identifier for resource that has parents. [${resourceConfig.name}]`
        )
      }

      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<
        RestCreateResult<CompositeIdentifierType>
      >((resolve, reject) => {
        const promiseResolver: RestCreatePromiseResolver<CompositeIdentifierType> = {
          requestKey,
          resolve,
          reject,
        }
        putCreatePromiseResolver(promiseResolver)
      })

      // Prepare POST request information
      const url = getApiUrlSingleAnon<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(parentsIdentifier ?? {}, resourceConfig)
      const data = overrideData ? overrideData : { ...state.fields }
      const body = JSON.stringify(data)

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'post',
        url,
        body
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    read: async (params?: ReadParamsType) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<
        RestReadResult<CompositeIdentifierType, AnonResourceType>
      >((resolve, reject) => {
        const promiseResolver: RestReadPromiseResolver<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          requestKey,
          resolve,
          reject,
        }
        putReadPromiseResolver(promiseResolver)
      })

      // Prepare GET request information
      const url = getApiUrlMany<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(resourceConfig, params)

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'get',
        url,
        null
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    update: async (
      compositeIdentifier: CompositeIdentifierType,
      overrideData?: AnonResourceType
    ) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<RestUpdateResult>(
        (resolve, reject) => {
          const promiseResolver: RestUpdatePromiseResolver = {
            requestKey,
            resolve,
            reject,
          }
          putUpdatePromiseResolver(promiseResolver)
        }
      )

      // Prepare PUT request information
      const url = getApiUrlSingle<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(compositeIdentifier, resourceConfig)
      const data = overrideData ? overrideData : { ...state.fields }
      const body = JSON.stringify(data)

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'put',
        url,
        body
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    delete: async (compositeIdentifier: CompositeIdentifierType) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<RestDeleteResult>(
        (resolve, reject) => {
          const promiseResolver: RestDeletePromiseResolver = {
            requestKey,
            resolve,
            reject,
          }
          putDeletePromiseResolver(promiseResolver)
        }
      )

      // Prepare DELETE request information
      const url = getApiUrlSingle(compositeIdentifier, resourceConfig)

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'delete',
        url,
        null
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    getField: (name: keyof AnonResourceType) => state.fields[name],
    setField: (name: keyof AnonResourceType, value: unknown) => {
      const action = creators.setField(name, value)
      dispatch(action)
    },
    clearFields: () => {
      const action = creators.clearFields()
      dispatch(action)
    },
    clearResponse: () => {
      const action = creators.clearResponse()
      dispatch(action)
    },
    getMany: (params?: ReadParamsType) => {
      const filterFn = resourceConfig.filter ?? (() => true)
      const sortFn = resourceConfig.sort ?? (() => 0)
      const postProcessFn =
        resourceConfig.postProcess ?? ((resourceList) => resourceList)
      const resourceList = state.resourceList
        .filter((resource, index) => filterFn(resource, params ?? {}, index))
        .sort((resourceA, resourceB) =>
          sortFn(resourceA, resourceB, params ?? {})
        )
      const processedResourceList = postProcessFn(resourceList, params ?? {})
      return processedResourceList
    },
    getOne: (compositeIdentifier: CompositeIdentifierType) =>
      state.resourceList.find((resource) => {
        const doIdentifiersMatch = resourceConfig.identifiers
          .map(
            (identifier) =>
              ((compositeIdentifier as unknown) as Record<string, string>)[
                identifier
              ] ===
              ((resource as unknown) as Record<string, string>)[identifier]
          )
          .reduce(
            (doPreviousAllMatch, doesCurrentMatch) =>
              doPreviousAllMatch && doesCurrentMatch,
            true
          )
        return doIdentifiersMatch
      }) ?? null,
    invalidate: () => {
      const action = creators.invalidate()
      dispatch(action)
    },
  }

  return _interface
}

export default generateRestInterface

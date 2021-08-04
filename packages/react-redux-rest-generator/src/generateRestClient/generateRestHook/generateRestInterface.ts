import { Action } from 'redux'
import generateUuid from '../../utils/generateUuid'
import getApiUrlMany from './getApiUrl/getApiUrlMany'
import getApiUrlSingle from './getApiUrl/getApiUrlSingle'
import getApiUrlSingleAnon from './getApiUrl/getApiUrlSingleAnon'

const generateRestInterface: (
  state: RestReduxState,
  dispatch: (action: Action) => void,
  creators: RestReduxCreatorSet,
  resourceConfig: RestResourceConfig,
  putCreatePromiseResolver: (resolver: RestCreatePromiseResolver) => void,
  putReadPromiseResolver: (resolver: RestReadPromiseResolver) => void,
  putUpdatePromiseResolver: (resolver: RestUpdatePromiseResolver) => void,
  putDeletePromiseResolver: (resolver: RestDeletePromiseResolver) => void
) => RestInterface = (
  state,
  dispatch,
  creators,
  resourceConfig,
  putCreatePromiseResolver,
  putReadPromiseResolver,
  putUpdatePromiseResolver,
  putDeletePromiseResolver
) => {
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
    create: async (parentsIdentifier?: Record<string, string>) => {
      // Ensure parentsIdentifier supplied if needed
      if (resourceConfig.identifiers.length > 1 && !parentsIdentifier) {
        throw new Error(
          `Expected parents identifier for resource that has parents. [${resourceConfig.name}]`
        )
      }

      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<{
        status: number
        message: string
        compositeIdentifier: Record<string, unknown> | null
      }>((resolve) => {
        const promiseResolver = {
          key: requestKey,
          resolve,
        }
        putCreatePromiseResolver(promiseResolver)
      })

      // Prepare POST request information
      const url = getApiUrlSingleAnon(parentsIdentifier ?? {}, resourceConfig)
      const data = { ...state.fields }
      const body = JSON.stringify(data)

      // Queue request
      const queueAction = creators.queueRequest(requestKey, 'post', url, body)
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    read: async (params?: RestReadParams) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<{
        status: number
        message: string
        resourceList: Array<Record<string, unknown>>
      }>((resolve) => {
        const promiseResolver = {
          key: requestKey,
          resolve,
        }
        putReadPromiseResolver(promiseResolver)
      })

      // Prepare GET request information
      const url = getApiUrlMany(resourceConfig, params)

      // Queue request
      const queueAction = creators.queueRequest(requestKey, 'get', url, null)
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    update: async (
      compositeIdentifier: Record<string, string>,
      overrideData?: Record<string, unknown>
    ) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<{ status: number; message: string }>(
        (resolve) => {
          const promiseResolver = {
            key: requestKey,
            resolve,
          }
          putUpdatePromiseResolver(promiseResolver)
        }
      )

      // Prepare PUT request information
      const url = getApiUrlSingle(compositeIdentifier, resourceConfig)
      const data = overrideData ? overrideData : { ...state.fields }
      const body = JSON.stringify(data)

      // Queue request
      const queueAction = creators.queueRequest(requestKey, 'put', url, body)
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    delete: async (compositeIdentifier: Record<string, string>) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<{ status: number; message: string }>(
        (resolve) => {
          const promiseResolver = {
            key: requestKey,
            resolve,
          }
          putDeletePromiseResolver(promiseResolver)
        }
      )

      // Prepare DELETE request information
      const url = getApiUrlSingle(compositeIdentifier, resourceConfig)

      // Queue request
      const queueAction = creators.queueRequest(requestKey, 'delete', url, null)
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    getField: (name: string) => state.fields[name as string],
    setField: (name: string, value: unknown) => {
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
    getMany: (params?: RestReadParams) => {
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
    getOne: (compositeIdentifier: Record<string, string>) =>
      state.resourceList.find((resource) => {
        const doIdentifiersMatch = resourceConfig.identifiers
          .map(
            (identifier) =>
              compositeIdentifier[identifier] === resource[identifier]
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

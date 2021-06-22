import axios from 'axios'
import { Action } from 'redux'
import getApiUrlMany from './getApiUrl/getApiUrlMany'
import getApiUrlSingle from './getApiUrl/getApiUrlSingle'
import getApiUrlSingleAnon from './getApiUrl/getApiUrlSingleAnon'

const generateRestInterface: (
  state: RestReduxState,
  dispatch: (action: Action) => void,
  creators: RestReduxCreatorSet,
  resourceConfig: RestResourceConfig
) => RestInterface = (state, dispatch, creators, resourceConfig) => {
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

      try {
        // Inform reducer that new resource is being created
        const fetchAction = creators.fetch('post')
        dispatch(fetchAction)

        // Post new resource
        const url = getApiUrlSingleAnon(parentsIdentifier ?? {}, resourceConfig)
        const data = { ...state.fields }
        const response = await axios.post(url, data)

        // Extract information from API response
        const status = response.status
        const message = response.data.message
        const payload = response.data.payload
        const compositeIdentifier = payload

        // Inform reducer that new resource has successfully been created
        const responseAction = creators.response(status, message, {
          compositeIdentifier,
        })
        dispatch(responseAction)

        return { status, message, compositeIdentifier }
      } catch (err) {
        // Throw error again if not recognizable API error
        if (!err.response) {
          throw err
        }

        // Extract information from API response
        const status = err.response.status
        const message = err.response.data.message

        // Log both axios error message and API error message
        console.error(err.message)
        console.error(message)

        // Inform reducer that new resource failed to be created
        const responseAction = creators.response(status, message, {})
        dispatch(responseAction)

        return { status, message, compositeIdentifier: null }
      }
    },
    read: async (params?: RestReadParams) => {
      try {
        // Inform reducer that resources are being fetched
        const fetchAction = creators.fetch('get')
        dispatch(fetchAction)

        // Fetch resource from API
        const url = getApiUrlMany(resourceConfig, params)
        const response = await axios.get(url)

        // 200 <= status < 300

        // Extract information from API response
        const status = response.status
        const message = response.data.message
        const listName =
          resourceConfig.apiPayloadResourceListName ??
          `${resourceConfig.name}List`
        const { [listName]: resourceList } = response.data.payload

        // Inform reducer that successful response has been received
        const responseAction = creators.response(status, message, {
          resourceList,
        })
        dispatch(responseAction)

        return {
          status,
          message,
          resourceList,
        }
      } catch (err) {
        // Throw error again if not recognizable API error
        if (!err.response) {
          throw err
        }

        // Extract information from API response
        const status = err.response.status
        const message = err.response.data.message

        // Log both axios error message and API error message
        console.error(err.message)
        console.error(message)

        // Inform reducer that erroneous response has been received
        const responseAction = creators.response(status, message, {
          resourceList: [],
        })
        dispatch(responseAction)

        return { status, message, resourceList: [] }
      }
    },
    update: async (compositeIdentifier: Record<string, string>) => {
      try {
        // Inform reducer that resource is being updated
        const fetchAction = creators.fetch('put')
        dispatch(fetchAction)

        // Post new resource
        const url = getApiUrlSingle(compositeIdentifier, resourceConfig)
        const data = { ...state.fields }
        const response = await axios.put(url, data)

        // Extract information form API response
        const status = response.status
        const message = response.data.message

        // Inform reducer that resource has successfully been updated
        const responseAction = creators.response(status, message, null)
        dispatch(responseAction)

        return { status, message, payload: null }
      } catch (err) {
        // Throw error again if not recognizable API error
        if (!err.response) {
          throw err
        }

        // Extract information from API response
        const status = err.response.status
        const message = err.response.data.message

        // Log both axios error message and API error message
        console.error(err.message)
        console.error(message)

        // Inform reducer that resource failed to be updated
        const responseAction = creators.response(status, message, null)
        dispatch(responseAction)

        return { status, message, payload: null }
      }
    },
    delete: async (compositeIdentifier: Record<string, string>) => {
      try {
        // Inform reducer that resource is being deleted
        const fetchAction = creators.fetch('delete')
        dispatch(fetchAction)

        // Delete test
        const url = getApiUrlSingle(compositeIdentifier, resourceConfig)
        const response = await axios.delete(url)

        // Extract information from API response
        const status = response.status
        const message = response.data.message

        // Inform reducer that resource has successfully been deleted
        const responseAction = creators.response(status, message, null)
        dispatch(responseAction)

        return { status, message, payload: null }
      } catch (err) {
        // Throw error again if not recognizable API error
        if (!err.response) {
          throw err
        }

        // Extract information from API response
        const status = err.response.status
        const message = err.response.data.message

        // Log both axios error message and API error message
        console.error(err.message)
        console.error(message)

        // Inform reducer that resource failed to be deleted
        const responseAction = creators.response(status, message, null)
        dispatch(responseAction)

        return { status, message, payload: null }
      }
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

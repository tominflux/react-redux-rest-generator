import axios from 'axios'
import { Action } from 'redux'
import getApiUrlMany from './getApiUrl/getApiUrlMany'
import getApiUrlSingle from './getApiUrl/getApiUrlSingle'
import getApiUrlSingleAnon from './getApiUrl/getApiUrlSingleAnon'

const generateRestInterface: (
    state: RestReduxState,
    dispatch: (action: Action) => any,
    creators: RestReduxCreatorSet,
    resourceConfig: RestResourceConfig
) => RestInterface = (state, dispatch, creators, resourceConfig) => ({
    fetching: state.fetching,
    method: state.method,
    status: state.status,
    message: state.message,
    create: async (parentsIdentifier?) => {
        try {
            // Inform reducer that new resource is being created
            const fetchAction = creators.fetch('post')
            dispatch(fetchAction)

            // Ensure parentsIdentifier supplied if needed
            if (resourceConfig.identifiers.length > 1) {
                throw new Error(
                    `Expected parents identifier for resource that has parents. [${resourceConfig.name}]`
                )
            }

            // Post new resource
            const url = getApiUrlSingleAnon(parentsIdentifier, resourceConfig)
            const data = { ...state.fields }
            const response = await axios.post(url, data)

            // Extract information from API response
            const status = response.status
            const message = response.data.message
            const payload = response.data.payload
            const compositeIdentifier = payload

            // Inform reducer that new resource has successfully been created
            const responseAction = creators.response(status, message, { compositeIdentifier })
            dispatch(responseAction)

            return { status, message, compositeIdentifier }
        } catch (err) {
            // Extract information from API response
            const status = err.response ? err.response.status : 500
            const message = err.response ? err.response.data.message : 'Internal Server Error'

            // Log both axios error message and API error message
            console.error(err.message)
            console.error(message)

            // Inform reducer that new resource failed to be created
            const responseAction = creators.response(status, message, {
                compositeIdentifier: null
            })
            dispatch(responseAction)

            return { status, message, compositeIdentifier: null }
        }
    },
    read: async (params?) => {
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
                resourceConfig.apiPayloadResourceListName ?? `${resourceConfig.name}List`
            const { [listName]: resourceList } = response.data.payload

            // Inform reducer that successful response has been received
            const responseAction = creators.response(status, message, { resourceList })
            dispatch(responseAction)

            return {
                status,
                message,
                resourceList
            }
        } catch (err) {
            // status >= 400

            // Extract information from API response
            const status = err.response ? err.response.status : 500
            const message = err.response ? err.response.data.message : 'Internal Server Error'

            // Log both axios error message and API error message
            console.error(err.message)
            console.error(message)

            // Inform reducer that erroronous response has been received
            const responseAction = creators.response(status, message, { resourceList: [] })
            dispatch(responseAction)

            return { status, message, resourceList: [] }
        }
    },
    update: async (compositeIdentifier) => {
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
            // Extract information from API response
            const status = err.response ? err.response.status : 500
            const message = err.response ? err.response.data.message : 'Internal Server Error'

            // Log both axios error message and API error message
            console.error(err.message)
            console.error(message)

            // Inform reducer that resource failed to be updated
            const responseAction = creators.response(status, message, null)
            dispatch(responseAction)

            return { status, message, payload: null }
        }
    },
    delete: async (compositeIdentifier?) => {
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
            // Extract information from API response
            const status = err.response ? err.response.status : 500
            const message = err.response ? err.response.data.message : 'Internal Server Error'

            // Log both axios error message and API error message
            console.error(err.message)
            console.error(message)

            // Inform reducer that resource failed to be deleted
            const responseAction = creators.response(status, message, null)
            dispatch(responseAction)

            return { status, message, payload: null }
        }
    },
    getField: (name) => state.fields[name as string],
    setField: (name, value) => {
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
    getMany: (params?) => {
        const filterFn = resourceConfig.filter ?? (() => true)
        const sortFn = resourceConfig.sort ?? (() => 1)
        return state.resourceList
            .filter((resource) => filterFn(resource, params))
            .sort((resourceA, resourceB) => sortFn(resourceA, resourceB, params))
    },
    getOne: (compositeIdentifier) =>
        state.resourceList.find((resource) => {
            const doIdentifiersMatch = resourceConfig.identifiers
                .map((identifier) => compositeIdentifier[identifier] === resource[identifier])
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
    }
})

export default generateRestInterface

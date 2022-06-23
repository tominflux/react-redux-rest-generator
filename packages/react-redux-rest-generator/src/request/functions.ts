import * as path from 'path'
import UtilFunctions from '../utils/functions'
import isStatusOk from '../utils/isStatusOk'
import {
  R3gAxiosResponseValidator,
  R3gAxiosResponseValidatorParams,
  R3gCreateRequestErrorResult,
  R3gCreateRequestSuccessResult,
  R3gCreateResultPayload,
  R3gDeleteRequestErrorResult,
  R3gDeleteRequestSuccessResult,
  R3gManyApiUrlGetter,
  R3gManyApiUrlGetterParams,
  R3gReadRequestErrorResult,
  R3gReadRequestSuccessResult,
  R3gReadResultPayload,
  R3gRequestResultGetter,
  R3gRequestResultGetterParams,
  R3gSingleAnonApiUrlGetter,
  R3gSingleAnonApiUrlGetterParams,
  R3gSingleApiUrlGetter,
  R3gSingleApiUrlGetterParams,
  R3gStringifiedParamsGetter,
  R3gStringifiedParamsGetterValidator,
  R3gStringifiedParamsGetterValidatorResult,
  R3gUpdateRequestErrorResult,
  R3gUpdateRequestSuccessResult,
} from './types'

// Function: Axios Response Validator
const validateAxiosResponse: R3gAxiosResponseValidator = <
  CompositeIdentifierType,
  AnonResourceType
>({
  resourceIdentifierKeys,
  resourceListName,
  resourcePropertyKeys,
  method,
  axiosResponse,
}: R3gAxiosResponseValidatorParams<
  CompositeIdentifierType,
  AnonResourceType
>) => {
  // Deconstruct: Axios response
  const { status, data } = axiosResponse

  // Derive: Was request successful
  const success = isStatusOk(status)

  // Deconstruct: Axios response data
  const { message, payload } = data

  // Fail Fast: Message should be string
  if (!message || typeof message !== 'string') {
    return 'NO_MESSAGE'
  }

  // Fail Fast: Expect no payload if request unsuccessful
  if (!success && payload) {
    return 'UNEXPECTED_PAYLOAD'
  }

  // Switch: request method
  switch (method) {
    case 'post': {
      // Condition: Successful POST request
      if (success) {
        // Fail Fast: Expected payload
        if (!payload || typeof payload !== 'object') {
          return 'NO_PAYLOAD'
        }

        // Fail Fast: Wrong payload format
        const payloadKeys = Object.keys(payload)
        const expectedKeys = resourceIdentifierKeys as Array<string>
        const containsAllExpectedKeys = expectedKeys.reduce(
          (onlyFoundExpectedKeys, currentKey) => {
            if (!onlyFoundExpectedKeys) return false
            if (!payloadKeys.includes(currentKey)) return false
            return true
          },
          true
        )
        const containsUnexpectedKey = payloadKeys.reduce(
          (foundUnexpectedKey, currentKey) => {
            if (!foundUnexpectedKey) return true
            if (!expectedKeys.includes(currentKey)) return true
            return false
          },
          true
        )
        if (!containsAllExpectedKeys || containsUnexpectedKey) {
          return 'WRONG_PAYLOAD_FORMAT'
        }

        // Fail Fast: Default
        return 'VALID'
      }

      // Condition: Erroneous POST request
      return 'VALID'
    }
    case 'get': {
      // Condition: Successful GET request
      if (success) {
        // Fail Fast: Expected payload
        if (!payload || typeof payload !== 'object') {
          return 'NO_PAYLOAD'
        }

        // Fail Fast: If payload does not match expected format
        const payloadKeys = Object.keys(payload)
        const expectedPayloadKeys = [resourceListName] as Array<string>
        const doPayloadKeysMatchExpected = UtilFunctions.checkIfSetsMatch({
          setList: [payloadKeys, expectedPayloadKeys],
        })
        if (!doPayloadKeysMatchExpected) {
          return 'WRONG_PAYLOAD_FORMAT'
        }
        const readPayload = payload as R3gReadResultPayload<
          CompositeIdentifierType,
          AnonResourceType
        >
        const resourceList = readPayload[resourceListName]
        if (
          !resourceList ||
          typeof resourceList !== 'object' ||
          !Array.isArray(resourceList)
        ) {
          return 'WRONG_PAYLOAD_FORMAT'
        }

        // Fail Fast: If resource instance does not match expected format
        const areResourceFormatsValid = resourceList
          .map((resourceInstance) => {
            const resourceKeys = Object.keys(resourceInstance)
            const expectedResourceKeys = [
              ...resourceIdentifierKeys,
              ...resourcePropertyKeys,
            ]
            const doResourceKeysMatchExpected = UtilFunctions.checkIfSetsMatch({
              setList: [resourceKeys, expectedResourceKeys],
            })
            return doResourceKeysMatchExpected
          })
          .reduce((doAllKeysMatchSoFar, doResourceKeysMatchExpected) => {
            if (!doAllKeysMatchSoFar) return false
            if (!doResourceKeysMatchExpected) return false
            return true
          }, true)
        if (!areResourceFormatsValid) {
          return 'WRONG_PAYLOAD_FORMAT'
        }

        // Fail Fast: Default
        return 'VALID'
      }

      // Condition: Erroneous GET request
      return 'VALID'
    }
    case 'put':
    case 'delete': {
      // Fail Fast: Unexpected payload
      if (payload) {
        return 'NO_PAYLOAD'
      }

      // Fail Fast: Default
      return 'VALID'
    }
    default: {
      return 'UNRECOGNIZED_METHOD'
    }
  }
}

// Function: Get Request Result
const getRequestResult: R3gRequestResultGetter = <
  CompositeIdentifierType,
  AnonResourceType
>({
  hookKey,
  requestKey,
  method,
  status,
  axiosResponseData,
}: R3gRequestResultGetterParams<CompositeIdentifierType, AnonResourceType>) => {
  // Deconstruct: Axios response data
  const { message, payload } = axiosResponseData

  // Derive: was request successful
  const success = isStatusOk(status)

  // Switch: request method
  switch (method) {
    case 'post': {
      // Condition: Successful request
      if (success) {
        // Construct: Request Result
        const requestResult: R3gCreateRequestSuccessResult<CompositeIdentifierType> = {
          requestKey,
          hookKey,
          method,
          status,
          success,
          message,
          payload: payload as R3gCreateResultPayload<CompositeIdentifierType>,
        }
        // Return
        return requestResult
      }

      // Construct: Request Result
      const requestResult: R3gCreateRequestErrorResult = {
        requestKey,
        hookKey,
        method,
        status,
        success,
        message,
        payload: payload as null,
      }

      // Return
      return requestResult
    }
    case 'get': {
      // Condition: Successful request
      if (success) {
        // Construct: Request Result
        const requestResult: R3gReadRequestSuccessResult<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          requestKey,
          hookKey,
          method,
          status,
          success,
          message,
          payload: payload as R3gReadResultPayload<
            CompositeIdentifierType,
            AnonResourceType
          >,
        }

        // Return
        return requestResult
      }

      // Construct: Request Result
      const requestResult: R3gReadRequestErrorResult = {
        requestKey,
        hookKey,
        method,
        status,
        success,
        message,
        payload: payload as null,
      }

      // Return: Request result
      return requestResult
    }
    case 'put': {
      // Condition: Successful request
      if (success) {
        // Construct: Request Result
        const requestResult: R3gUpdateRequestSuccessResult = {
          requestKey,
          hookKey,
          method,
          status,
          success,
          message,
          payload: payload as null,
        }

        // Return
        return requestResult
      }

      // Construct: Request Result
      const requestResult: R3gUpdateRequestErrorResult = {
        requestKey,
        hookKey,
        method,
        status,
        success,
        message,
        payload: payload as null,
      }

      // Return
      return requestResult
    }
    case 'delete': {
      // Condition: Successful request
      if (success) {
        // Construct: Request Result
        const requestResult: R3gDeleteRequestSuccessResult = {
          requestKey,
          hookKey,
          method,
          status,
          success,
          message,
          payload: payload as null,
        }

        // Return
        return requestResult
      }

      // Construct: Request Result
      const requestResult: R3gDeleteRequestErrorResult = {
        requestKey,
        hookKey,
        method,
        status,
        success,
        message,
        payload: payload as null,
      }

      // Return
      return requestResult
    }
  }
}

// Function: Param Stringification Validator
const validateParamsStringification: R3gStringifiedParamsGetterValidator = (
  params
) =>
  Object.entries(
    params
  ).reduce<R3gStringifiedParamsGetterValidatorResult | null>(
    (erroneousResult, [key, value]) => {
      if (erroneousResult) return erroneousResult

      // Fail Fast: If value is array
      if (typeof value === 'object' && Array.isArray(value)) {
        const areArrayElementsValid = value.reduce(
          (isValidThusFar, element) => {
            if (!isValidThusFar) return false
            if (typeof element === 'string') return true
            if ((element.toString ?? null) !== null) return true
            return false
          },
          true
        )

        // Fail Fast: Invalid element
        if (!areArrayElementsValid) {
          return {
            validationStatus: 'INVALID_ARRAY_ELEMENT',
            erroneousParamKey: key,
          }
        }

        // Fail Fast: All elements valid
        return {
          validationStatus: 'VALID',
          erroneousParamKey: null,
        }
      }

      // Fail Fast: Has to string method
      const potentiallyStringable = value as { toString?: () => string }
      const hasToStringMethod =
        (potentiallyStringable.toString ?? null) !== null
      if (hasToStringMethod) {
        return {
          validationStatus: 'VALID',
          erroneousParamKey: null,
        }
      }

      // Fail Fast: No to string method
      return {
        validationStatus: 'NO_TO_STRING_METHOD',
        erroneousParamKey: key,
      }
    },
    null
  ) ?? {
    validationStatus: 'VALID',
    erroneousParamKey: null,
  }

// Function: Stringified Params Getter
const getStringifiedParams: R3gStringifiedParamsGetter = (
  params: Record<string, unknown>
) => {
  const stringifiedEntries = Object.entries<unknown>(params).map<
    [string, string | null]
  >(([key, value]) => {
    // Fail Fast: Return null values as is
    if (value === null) {
      return [key, null]
    }

    // Fail Fast: Return string as is
    if (typeof value === 'string') return [key, value]

    // Fail Fast: Return array as CSV
    if (typeof value === 'object' && Array.isArray(value)) {
      const arrayParam = value as Array<string | number | boolean>
      const stringifiedSubValues = arrayParam.map((subValue) => {
        if (typeof subValue === 'string') return subValue
        if ((subValue.toString ?? null) !== null) return subValue.toString()
        return ''
      })
      const escapedSubValues = stringifiedSubValues.map((subValue) =>
        encodeURIComponent(subValue)
      )
      const csv = escapedSubValues.join(',')
      return [key, csv]
    }

    // Fail Fast: Attempt to use toString on any other type
    const potentiallyStringable = value as { toString?: () => string }
    if ((potentiallyStringable.toString ?? null) !== null) {
      const stringable = potentiallyStringable as { toString: () => string }
      return [key, stringable.toString()]
    }

    return [key, '']
  })

  const stringifiedParams = Object.fromEntries(stringifiedEntries)
  return stringifiedParams
}

// Function: Single Anonymous Resource API Url Getter
const getApiUrlSingleAnon: R3gSingleAnonApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>({
  parentsIdentifier,
  resourceConfig,
}: R3gSingleAnonApiUrlGetterParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>) => {
  // Deconstruct: Resource configuration
  const {
    composition: parentResourceConfigList,
    identifiers: resourceIdentifierKeys,
  } = resourceConfig

  // Derive: Parent Route Parts
  const parentRouteParts = parentResourceConfigList
    .map((parentResourceConfig, index) => {
      const { name: parentResourceName } = parentResourceConfig
      const parentPrimaryIdentifierKey = resourceIdentifierKeys[index]
      const parentPrimaryIdentifier =
        parentsIdentifier[parentPrimaryIdentifierKey as string]
      return [parentResourceName, parentPrimaryIdentifier]
    })
    .flat(1)

  // Deconstruct: Resource configuration
  const { name: childRoutePart, apiRootPath } = resourceConfig

  // Derive: URL
  const url = path.join(apiRootPath, ...parentRouteParts, childRoutePart)
  return url
}

// Function: Single Resource API Url Getter
const getApiUrlSingle: R3gSingleApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>({
  resourceIdentifier,
  resourceConfig,
}: R3gSingleApiUrlGetterParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>) => {
  // Deconstruct: Resource configuration
  const {
    composition: parentResourceConfigList,
    identifiers: resourceIdentifierKeys,
  } = resourceConfig

  // Derive: Parent Route Parts
  const parentRouteParts = parentResourceConfigList
    .map((parentResourceConfig, index) => {
      const { name: parentResourceName } = parentResourceConfig
      const parentPrimaryIdentifierKey = resourceIdentifierKeys[index]
      const parentPrimaryIdentifier = `${resourceIdentifier[parentPrimaryIdentifierKey]}`
      return [parentResourceName, parentPrimaryIdentifier]
    })
    .flat(1)

  // Deconstruct: Resource configuration
  const {
    name: resourceName,
    primaryIdentifier: primaryIdentifierKey,
    apiRootPath,
  } = resourceConfig

  // Derive: Resource instance's primary identifier
  const primaryIdentifier = `${resourceIdentifier[primaryIdentifierKey]}`

  // Concatenate: Child route parts
  const childRouteParts = [resourceName, primaryIdentifier]

  // Derive: URL
  const url = path.join(apiRootPath, ...parentRouteParts, ...childRouteParts)
  return url
}

const getApiUrlMany: R3gManyApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>({
  readParams,
  resourceConfig,
}: R3gManyApiUrlGetterParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>) => {
  // Deconstruct: Resource configuration
  const { composition: parentResourceConfigList } = resourceConfig

  // Derive: Parent Route Parts
  const parentRouteParts = parentResourceConfigList.map(
    ({ name: parentResourceName }) => parentResourceName
  )

  // Deconstruct: Resource configuration
  const { name: resourceName, apiRootPath } = resourceConfig

  // Derive: URL
  const url = path.join(apiRootPath, ...parentRouteParts, resourceName)

  // Create query-string
  const urlParams = R3gRequestFunctions.getStringifiedParams(
    readParams as Record<string, unknown>
  )
  const filterUrlParamEntries = Object.entries(urlParams).filter(
    (entry) => entry[1] !== null
  ) as [string, string][]
  const filteredUrlParams = Object.fromEntries(filterUrlParamEntries)
  const query = new URLSearchParams(filteredUrlParams)

  // Return: URL + query
  return `${url}?${query}`
}

// Construct: R3gRequestFunctions
const R3gRequestFunctions = {
  validateAxiosResponse,
  getRequestResult,
  validateParamsStringification,
  getStringifiedParams,
  getApiUrlSingleAnon,
  getApiUrlSingle,
  getApiUrlMany,
}

export default R3gRequestFunctions

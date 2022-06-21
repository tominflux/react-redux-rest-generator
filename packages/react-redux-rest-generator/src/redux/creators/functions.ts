import { R3gRequestMethod, R3gRequestResult } from '../../request/types'
import {
  GetR3gCreatorFunction,
  GetR3gCreatorFunctionParams,
  R3gCancelRequestCreator,
  R3gClearFieldsCreator,
  R3gClearResponseCreator,
  R3gCreatorRecord,
  R3gFetchCreator,
  R3gInvalidateCreator,
  R3gQueueRequestCreator,
  R3gResolveCreator,
  R3gResponseCreator,
  R3gSetFieldCreator,
} from './types'

// Function: Get R3G Redux Creator record
const getR3gCreatorRecord: GetR3gCreatorFunction = <
  CompositeIdentifierType,
  AnonResourceType
>({
  actionKeyRecord,
}: GetR3gCreatorFunctionParams) => {
  // Function: Set Field action creator
  const setField: R3gSetFieldCreator<AnonResourceType> = (
    name: keyof AnonResourceType,
    value: unknown
  ) => ({
    type: actionKeyRecord.setField,
    payload: { name, value },
  })

  // Function: Queue Request action creator
  const queueRequest: R3gQueueRequestCreator = (
    requestKey: string,
    hookKey: string,
    method: R3gRequestMethod,
    url: string,
    body: string | null
  ) => ({
    type: actionKeyRecord.queueRequest,
    payload: { requestKey, hookKey, method, url, body },
  })

  // Function: Cancel Request creator
  const cancelRequest: R3gCancelRequestCreator = (requestKey: string) => ({
    type: actionKeyRecord.cancelRequest,
    payload: { requestKey },
  })

  // Function: Fetch creator
  const fetch: R3gFetchCreator = (requestKey: string) => ({
    type: actionKeyRecord.fetch,
    payload: { requestKey },
  })

  // Function: Response creator
  const response: R3gResponseCreator<
    CompositeIdentifierType,
    AnonResourceType
  > = (
    requestResult: R3gRequestResult<CompositeIdentifierType, AnonResourceType>
  ) => ({
    type: actionKeyRecord.response,
    payload: {
      requestResult,
    },
  })

  // Function: Resolve creator
  const resolve: R3gResolveCreator = (requestKey: string) => ({
    type: actionKeyRecord.resolve,
    payload: { requestKey },
  })

  // Function: Invalidate creator
  const invalidate: R3gInvalidateCreator = () => ({
    type: actionKeyRecord.invalidate,
    payload: {},
  })

  // Function: Clear fields creator
  const clearFields: R3gClearFieldsCreator = () => ({
    type: actionKeyRecord.clearFields,
    payload: {},
  })

  // Function: Clear response creator
  const clearResponse: R3gClearResponseCreator = () => ({
    type: actionKeyRecord.clearResponse,
    payload: {},
  })

  // Construct: R3G Creator record
  const r3gCreators: R3gCreatorRecord<
    CompositeIdentifierType,
    AnonResourceType
  > = {
    setField,
    queueRequest,
    cancelRequest,
    fetch,
    response,
    resolve,
    invalidate,
    clearFields,
    clearResponse,
  }

  return r3gCreators
}

// Construct: R3G Creator functions
const R3gCreatorFunctions = {
  getR3gCreatorRecord,
}

export default R3gCreatorFunctions

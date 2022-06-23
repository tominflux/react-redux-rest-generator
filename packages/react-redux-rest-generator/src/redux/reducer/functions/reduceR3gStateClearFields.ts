import { R3gClearFieldsReducer, R3gClearFieldsReducerParams } from '../types'

// Reducer: Clear fields
const reduceR3gStateClearFields: R3gClearFieldsReducer = <
  ResourceIdentifier,
  ResourceBody
>({
  state,
  payload,
  initialResourceFields,
}: R3gClearFieldsReducerParams<ResourceIdentifier, ResourceBody>) => {
  // Deconstruct: Payload
  const {} = payload

  // Derive: Next fields
  const nextFields = { ...initialResourceFields }

  // Construct: Next state
  return {
    ...state,
    fields: nextFields,
  }
}

export default reduceR3gStateClearFields

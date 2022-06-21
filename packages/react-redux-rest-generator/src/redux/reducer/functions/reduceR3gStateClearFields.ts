import { R3gClearFieldsReducer, R3gClearFieldsReducerParams } from '../types'

// Reducer: Clear fields
const reduceR3gStateClearFields: R3gClearFieldsReducer = <
  CompositeIdentifierType,
  AnonResourceType
>({
  state,
  payload,
  initialResourceFields,
}: R3gClearFieldsReducerParams<CompositeIdentifierType, AnonResourceType>) => {
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

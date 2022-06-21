import { R3gSetFieldReducer, R3gSetFieldReducerParams } from '../types'

// Reducer: Set Field
const reduceR3gStateSetField: R3gSetFieldReducer = <
  CompositeIdentifierType,
  AnonResourceType
>({
  state,
  payload,
}: R3gSetFieldReducerParams<CompositeIdentifierType, AnonResourceType>) => {
  // Deconstruct: Set Field action payload
  const { name, value } = payload

  // Deconstruct: Fields from state
  const { fields: prevFields } = state

  // Construct: New fields with updated value
  const nextFields: AnonResourceType = {
    ...prevFields,
    [name]: value,
  }

  // Return: Updated state
  return {
    ...state,
    fields: nextFields,
  }
}

export default reduceR3gStateSetField

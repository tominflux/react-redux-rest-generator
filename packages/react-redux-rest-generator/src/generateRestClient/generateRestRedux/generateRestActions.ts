import { RestReduxActionsGenerator, RestReduxActionSet } from '../../types'
import mapObj from '../../utils/mapObj'

const actionsTemplate = {
  SET_FIELD: 'SET_FIELD',
  QUEUE_REQUEST: 'QUEUE_REQUEST',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  FETCH: 'FETCH',
  RESPONSE: 'RESPONSE',
  INVALIDATE: 'INVALIDATE',
  CLEAR_FIELDS: 'CLEAR_FIELDS',
  CLEAR_RESPONSE: 'CLEAR_RESPONSE',
}

const generateRestActions: RestReduxActionsGenerator = (resourceConfig) => {
  const { name: resourceName } = resourceConfig

  const actions = mapObj(actionsTemplate, (key, value) => ({
    key,
    value: `R3G_${resourceName.toUpperCase()}_${value}`,
  }))

  return actions as RestReduxActionSet
}

export default generateRestActions

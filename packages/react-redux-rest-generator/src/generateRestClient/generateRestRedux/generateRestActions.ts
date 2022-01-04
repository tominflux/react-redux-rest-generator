import { RestReduxActionsGenerator, RestReduxActionSet } from '../../types'
import mapObj from '../../utils/mapObj'

const actionsTemplate = {
  SET_FIELD: 'R3G_SET_FIELD',
  QUEUE_REQUEST: 'R3G_QUEUE_REQUEST',
  CANCEL_REQUEST: 'R3G_CANCEL_REQUEST',
  FETCH: 'R3G_FETCH',
  RESPONSE: 'R3G_RESPONSE',
  INVALIDATE: 'R3G_INVALIDATE',
  CLEAR_FIELDS: 'R3G_CLEAR_FIELDS',
  CLEAR_RESPONSE: 'R3G_CLEAR_RESPONSE',
}

const generateRestActions: RestReduxActionsGenerator = (resourceConfig) => {
  const { name: resourceName } = resourceConfig

  const actions = mapObj(actionsTemplate, (key, value) => ({
    key,
    value: `${resourceName.toUpperCase()}_${value}`,
  }))

  return actions as RestReduxActionSet
}

export default generateRestActions

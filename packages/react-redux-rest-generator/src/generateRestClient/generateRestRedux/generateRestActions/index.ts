import mapObj from '../../../utils/mapObj'
import {
  RestReduxActionKey,
  RestReduxActionSet,
  RestReduxActionsGenerator,
} from './types'

const actionsTemplate: Record<RestReduxActionKey, RestReduxActionKey> = {
  SET_FIELD: 'SET_FIELD',
  QUEUE_REQUEST: 'QUEUE_REQUEST',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  FETCH: 'FETCH',
  RESPONSE: 'RESPONSE',
  RESOLVE: 'RESOLVE',
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

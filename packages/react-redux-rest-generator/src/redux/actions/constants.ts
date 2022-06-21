import { R3gActionKeySuffix } from './types'

const actionKeySuffixList: Array<R3gActionKeySuffix> = [
  'SET_FIELD',
  'QUEUE_REQUEST',
  'CANCEL_REQUEST',
  'FETCH',
  'RESPONSE',
  'RESOLVE',
  'INVALIDATE',
  'CLEAR_FIELDS',
  'CLEAR_RESPONSE',
]

const R3gActionConstants = {
  actionKeySuffixList,
}
export default R3gActionConstants

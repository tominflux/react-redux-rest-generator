import { R3gActionKeyRecordKey, R3gActionKeySuffix } from './types'

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

const actionKeyRecordKeyList: Array<R3gActionKeyRecordKey> = [
  'setField',
  'queueRequest',
  'cancelRequest',
  'fetch',
  'response',
  'resolve',
  'invalidate',
  'clearFields',
  'clearResponse',
]

const R3gActionConstants = {
  actionKeySuffixList,
  actionKeyRecordKeyList,
}

export default R3gActionConstants

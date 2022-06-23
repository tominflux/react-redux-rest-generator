import R3gActionConstants from './constants'
import {
  R3gActionKey,
  R3gActionKeySuffix,
  R3gActionKeyRecord,
  GetGenericR3gActionKeyRecord,
  R3gActionKeyRecordKey,
} from './types'

// Deconstruct: R3G action constants
const { actionKeySuffixList, actionKeyRecordKeyList } = R3gActionConstants

// Function: Get generic R3G action key record
const getActionKeyRecord: GetGenericR3gActionKeyRecord = (params) => {
  // Deconstruct: Params
  const { resourceName } = params

  // Derivation: Entries for action key record
  const actionRecordEntries = actionKeySuffixList.map<
    [R3gActionKeyRecordKey, R3gActionKey]
  >((actionKeySuffix, index) => [
    actionKeyRecordKeyList[index],
    `R3G_${actionKeySuffix}_${resourceName.toUpperCase()}`,
  ])

  // Construct: Action key record
  const actionKeyRecord = Object.fromEntries(
    actionRecordEntries
  ) as R3gActionKeyRecord

  return actionKeyRecord
}

// Construct: R3G action functions
const R3gActionFunctions = {
  getActionKeyRecord,
}

export default R3gActionFunctions

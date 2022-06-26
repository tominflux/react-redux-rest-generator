import {
  CheckIfSetsMatchFunction,
  CheckIfSetsMatchFunctionParams,
} from './types'

// Function: Check if list of sets all match
const checkIfSetsMatch: CheckIfSetsMatchFunction = ({
  setList,
}: CheckIfSetsMatchFunctionParams) => {
  // Select: first set as 'set A' and remaining sets
  const [setA, ...remainingSetList] = setList

  // Fail Fast: If no sets provided, then sets match by default
  if (!setA) return true

  // Derive: Do all set A elements exist in other sets?
  const doAllSetAElementsExistInOthers = setA
    .map((setAElement) => {
      const doesSetAElementExistInOthers = remainingSetList
        .map((setX) => {
          const doesElementExistInX = setX.includes(setAElement)
          return doesElementExistInX
        })
        .reduce((doesElementExistInAllSoFar, doesElementExistInX) => {
          if (!doesElementExistInAllSoFar) return false
          if (!doesElementExistInX) return false
          return true
        }, true)
      return doesSetAElementExistInOthers
    })
    .reduce(
      (doAllSetAElementsExistInOthersSoFar, doesSetAElementExistInOthers) => {
        if (!doAllSetAElementsExistInOthersSoFar) return false
        if (!doesSetAElementExistInOthers) return false
        return true
      },
      true
    )

  // Derive: Do all other set elements exist in set A?
  const doAllOtherSetElementsExistInA = remainingSetList
    .map((setX) => {
      const doAllSetXElementsExistInA = setX
        .map((setXElement) => setA.includes(setXElement))
        .reduce((doAllElementsExistInASoFar, doesElementExistInA) => {
          if (!doAllElementsExistInASoFar) return false
          if (!doesElementExistInA) return false
          return true
        }, true)
      return doAllSetXElementsExistInA
    })
    .reduce((doAllOtherSetElementsExistInASoFar, doAllSetXElementsExistInA) => {
      if (!doAllOtherSetElementsExistInASoFar) return false
      if (!doAllSetXElementsExistInA) return false
      return true
    }, true)

  // Derive: Do all sets match
  const doAllSetsMatch =
    doAllSetAElementsExistInOthers && doAllOtherSetElementsExistInA
  return doAllSetsMatch
}

const UtilFunctions = { checkIfSetsMatch }

export default UtilFunctions

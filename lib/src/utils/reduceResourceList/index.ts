const doKeysMatch: <T extends Record<string, unknown>>(
  resourceA: T,
  resourceB: T,
  keyNames: Array<string>
) => boolean = (resourceA, resourceB, keyNames) =>
  keyNames
    .map((keyName) => resourceA[keyName] === resourceB[keyName])
    .reduce(
      (doPreviousAllMatch, doesCurrentMatch) =>
        doPreviousAllMatch && doesCurrentMatch,
      true
    )

/**
 * Merge resource lists.
 * Replace obsolete elements,
 * keep old elements that have no replacement,
 * and add new elements that did not previously exist, all into one array.
 */
const reduceResourceList: <T extends Record<string, unknown>>(
  existingResourceList: Array<T>,
  newResourceList: Array<T>,
  keyNames: Array<string>
) => Array<T> = (existingResourceList, newResourceList, keyNames) => {
  const unaffectedResourceList = existingResourceList.filter(
    (existingResource) =>
      !newResourceList.find((newResource) =>
        doKeysMatch(existingResource, newResource, keyNames)
      )
  )
  const nextResourceList = [...newResourceList, ...unaffectedResourceList]
  return nextResourceList
}

export default reduceResourceList

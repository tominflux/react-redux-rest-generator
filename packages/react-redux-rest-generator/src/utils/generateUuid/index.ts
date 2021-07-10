/**
 * Creates a random ID.
 */
export const generateUuid: (length?: number) => string = (
  length = 5
): string => {
  const random = Math.random()
  const randomString = random.toString(36).substr(2)
  const alphaNumeric = randomString.replace(/[^0-z]+/g, '')
  const fiveCharacters = alphaNumeric.substr(0, length)
  const id = fiveCharacters
  return id
}

export default generateUuid

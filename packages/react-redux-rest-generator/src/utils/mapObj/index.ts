/**
 * Performs map operation on an object.
 * Can be used to transform one object into another.
 */
const mapObj: (
  obj: Record<string, unknown>,
  func: (key: string, value: unknown) => { key: string; value: unknown }
) => Record<string, unknown> = (obj, func) => {
  const entries = Object.entries(obj)

  if (entries.length === 0) {
    return {}
  }

  const [key, value] = entries[0]
  const next = func(key, value)

  const remainingEntries = entries.slice(1)
  const remaining = Object.fromEntries(remainingEntries)

  return {
    [next.key]: next.value,
    ...mapObj(remaining, func),
  }
}

export default mapObj

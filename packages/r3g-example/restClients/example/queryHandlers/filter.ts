import { DateTime } from 'luxon'

const filterExample = (example: ExampleIdentifier & ExampleBody, params: ReadExampleParams) => {
    const { key, title, expired } = params

    // Match key filter
    const keyFilterEnabled = (key ?? null) !== null
    if (keyFilterEnabled && example.key !== key) return false

    // Match title filter
    const titleFilterEnabled = (title ?? null) !== null
    if (titleFilterEnabled && example.title !== title) return false

    // Match expired filter
    const expiredFilterEnabled = (expired ?? null) !== null
    if (expiredFilterEnabled) {
        const expiryTimestamp = DateTime.fromISO(example.expiryDate).valueOf()
        const currentTimestamp = DateTime.now().valueOf()
        const isExpired = expiryTimestamp <= currentTimestamp
        const conditionGetters = {
            true: () => isExpired,
            false: () => !isExpired
        }
        const getCondition = conditionGetters[expired.toString()]
        const matchesCondition = getCondition()
        return matchesCondition
    }

    return true
}

export default filterExample

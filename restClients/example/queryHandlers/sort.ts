import { DateTime } from 'luxon'

const sortExample = (
    exampleA: ExampleCompositeIdentifier & ExampleSerialized,
    exampleB: ExampleCompositeIdentifier & ExampleSerialized,
    params: ReadExampleParams
) => {
    const { byExpiryDate } = params

    // Sort by expiry date
    const byExpiryDateEnabled = (byExpiryDate ?? null) !== null
    if (byExpiryDateEnabled) {
        const timestampA = DateTime.fromISO(exampleA.expiryDate).valueOf()
        const timestampB = DateTime.fromISO(exampleB.expiryDate).valueOf()
        return timestampA - timestampB
    }

    // Leave as is
    return 0
}

export default sortExample

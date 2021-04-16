// Example Model

type ExampleCompositeIdentifier = {
    key: string
}

type Example = {
    title: string
    description: string
    expiryDate: Date
}

type ExampleSerialized = {
    title: string
    description: string
    expiryDate: string
}

// Example Model - Create

type CreateExampleData = ExampleSerialized
type CreateExamplePayload = ExampleCompositeIdentifier
type CreateExampleResult = {
    status: 201 | 406 | 409
    message: string
    payload: CreateExamplePayload | null
}

// Example Model - Read
type ReadExampleParams = {
    key?: string
    title?: string
    expired?: boolean
    byExpiryDate?: boolean
}
type ReadExamplePayload = {
    exampleList: Array<ExampleCompositeIdentifier & ExampleSerialized>
}
type ReadExampleResult = {
    status: 200
    message: string
    payload: ReadExamplePayload
}

// Example Model - Update
type UpdateExampleParams = ExampleCompositeIdentifier
type UpdateExampleData = ExampleSerialized
type UpdateExampleResult = {
    status: 204 | 404 | 406
    payload: null
}

// Example Model - Delete
type DeleteExampleParams = ExampleCompositeIdentifier
type DeleteExampleResult = {
    status: 204 | 404 | 406
    payload: null
}

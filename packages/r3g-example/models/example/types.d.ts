// Example Model

type ExampleIdentifier = {
    key: string
}

type Example = {
    title: string
    description: string
    expiryDate: Date
}

type ExampleBody = {
    title: string
    description: string
    expiryDate: string
}

// Example Model - Create

type CreateExampleData = ExampleBody
type CreateExamplePayload = ExampleIdentifier
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
    exampleList: Array<ExampleIdentifier & ExampleBody>
}
type ReadExampleResult = {
    status: 200
    message: string
    payload: ReadExamplePayload
}

// Example Model - Update
type UpdateExampleParams = ExampleIdentifier
type UpdateExampleData = ExampleBody
type UpdateExampleResult = {
    status: 200 | 404 | 406
    message: string
    payload: null
}

// Example Model - Delete
type DeleteExampleParams = ExampleIdentifier
type DeleteExampleResult = {
    status: 200 | 404 | 406
    message: string
    payload: null
}

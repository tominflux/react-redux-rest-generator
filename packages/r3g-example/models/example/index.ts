import { Db } from 'mongodb'
import concatAggregations from 'utils/concatAggregations'
import generateUUID from 'utils/generateUUID'

const serialize: (example: Example) => ExampleSerialized = (example) => {
    return {
        ...example,
        expiryDate: example.expiryDate.toISOString()
    }
}

const deserialize: (example: ExampleSerialized) => Example = (example) => {
    return {
        ...example,
        expiryDate: new Date(example.expiryDate)
    }
}

const create: (db: Db, data: CreateExampleData) => Promise<CreateExampleResult> = async (
    db,
    data
) => {
    // Destructure to validate data shape.
    const { title, description, expiryDate } = data

    // Validate data
    //  - Ensure title <= 80 characters
    if (title.length > 80) {
        return {
            status: 406,
            message: 'Maximum title length is 80 characters.',
            payload: null
        }
    }
    //  - Ensure description <= 240 characters
    if (description.length > 240) {
        return {
            status: 406,
            message: 'Maximum description length is 240 characters.',
            payload: null
        }
    }
    //  - Ensure title is unique
    const titleExists = (await read(db, { title })).payload.exampleList.length > 0
    if (titleExists) {
        return {
            status: 409,
            message: 'Title must be unique.',
            payload: null
        }
    }

    // Generate key
    const key = generateUUID(7)

    // Create example object (serialized) from API data
    const exampleSerialized: ExampleSerialized = {
        title,
        description,
        expiryDate
    }

    // Deserialize into Example model properties
    const example = deserialize(exampleSerialized)

    // Add identifer
    const exampleIdentified: ExampleCompositeIdentifier & Example = {
        key,
        ...example
    }

    // Insert into db
    await db.collection('example').insertOne(exampleIdentified)
    console.log(` - Example created: ${key}`)

    // Return success
    return {
        status: 201,
        message: 'Created new Example successfully.',
        payload: { key }
    }
}

const read: (db: Db, params: ReadExampleParams) => Promise<ReadExampleResult> = async (
    db,
    params
) => {
    const { key, title, expired, byExpiryDate } = params

    // Define query/filter aggregations
    const getMatchKey = () => ({ $match: { key } })
    const getMatchTitle = () => ({ $match: { title } })
    const getMatchExpired = () => {
        const cases = {
            true: {
                $match: {
                    $expiryDate: {
                        $lte: new Date(Date.now())
                    }
                }
            },
            false: {
                $match: {
                    $expiryDate: {
                        $gt: new Date(Date.now())
                    }
                }
            }
        }
        return cases[expired.toString()]
    }

    // Define augmentation aggregations
    const getSortByExpiryDate = () => ({
        $sort: {
            expiryDate: -1
        }
    })
    const getProjectFinal = () => ({
        $project: {
            key: '$key',
            title: '$title',
            description: '$description',
            expiryDate: '$expiryDate'
        }
    })

    // Build aggregations
    const aggregations = concatAggregations([
        {
            enabled: (key ?? null) !== null,
            aggregation: getMatchKey
        },
        {
            enabled: (title ?? null) !== null,
            aggregation: getMatchTitle
        },
        {
            enabled: (expired ?? null) !== null,
            aggregation: getMatchExpired
        },
        {
            enabled: byExpiryDate ?? false,
            aggregation: getSortByExpiryDate
        },
        {
            enabled: true,
            aggregation: getProjectFinal
        }
    ])

    console.log(aggregations)

    // Aggregate Examples
    const cursor = await db.collection('example').aggregate(aggregations)
    const results: Array<Record<string, unknown>> = await cursor.toArray()

    // Serialize results
    const exampleList = results.map((resultInstance) => {
        // Destructure & restructure to validate shape
        const { key, title, description, expiryDate } = resultInstance
        const exampleCompositeIdentifier = {
            key: key as string
        }
        const example: Example = {
            title: title as string,
            description: description as string,
            expiryDate: expiryDate as Date
        }

        // Serialize example model properties
        const exampleSerialized = serialize(example)

        return {
            ...exampleCompositeIdentifier,
            ...exampleSerialized
        }
    })

    // Return success
    return {
        status: 200,
        message: 'Found examples.',
        payload: { exampleList }
    }
}

const update: (
    db: Db,
    params: UpdateExampleParams,
    data: UpdateExampleData
) => Promise<UpdateExampleResult> = async (db, params, data) => {
    const { key } = params
    const { ...exampleSerialized } = data

    // Ensure key not falsy
    if (!key) {
        return {
            status: 406,
            message: `Example key must be provided.`,
            payload: null
        }
    }

    // Ensure Example exists
    const exampleExists = (await read(db, { key })).payload.exampleList.length > 0
    if (!exampleExists) {
        return {
            status: 404,
            message: `Example ${key} does not exist.`,
            payload: null
        }
    }

    // Build example model props
    const example = deserialize(exampleSerialized)
    const exampleIdentified: ExampleCompositeIdentifier & Example = {
        key,
        ...example
    }

    // Update example
    await db.collection('example').replaceOne({ key }, exampleIdentified)

    // Return success
    return {
        status: 204,
        message: `Example ${key} successfully updated.`,
        payload: null
    }
}

const _delete: (db: Db, params: DeleteExampleParams) => Promise<DeleteExampleResult> = async (
    db,
    params
) => {
    const { key } = params

    // Ensure key not falsy
    if (!key) {
        return {
            status: 406,
            message: `Example key must be provided.`,
            payload: null
        }
    }

    // Ensure Example exists
    const exampleExists = (await read(db, { key })).payload.exampleList.length > 0
    if (!exampleExists) {
        return {
            status: 404,
            message: `Example ${key} does not exist.`,
            payload: null
        }
    }

    // Delete example
    await db.collection('example').deleteOne({ key })

    // Return success
    return {
        status: 204,
        message: `Example ${key} successfully deleted.`,
        payload: null
    }
}

const ExampleModel = {
    create,
    read,
    update,
    delete: _delete
}

export default ExampleModel

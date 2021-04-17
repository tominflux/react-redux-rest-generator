import { MongoClient, MongoClientOptions, Db } from 'mongodb'

const MAX_ATTEMPTS = 3
const RETRY_PERIOD = 10 * 1000

/**
 * Try to connect.
 * If failed, try again after retry period.
 * Throw error if max attempts reached.
 */
const recurConnect: (
    url: string,
    opts: MongoClientOptions,
    count?: number
) => Promise<MongoClient> = async (url, opts, count = 0) => {
    const attempts = count + 1
    try {
        const connection = await MongoClient.connect(url, {
            useUnifiedTopology: true
        })
        return connection
    } catch (err) {
        if (attempts >= MAX_ATTEMPTS) {
            console.error(err.message)
            throw new Error('Could not connect to database. Max retry attempts exceeded.')
        } else {
            return await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const connection = await recurConnect(url, opts, attempts)
                        resolve(connection)
                    } catch (err) {
                        reject(err.message)
                    }
                }, RETRY_PERIOD)
            })
        }
    }
}

export const connectToDatabase: () => Promise<Db> = async () => {
    const url = process.env.MONGO_DB_URI
    if (!url) {
        throw new Error('No URL of db provided.')
    }

    const connection = await recurConnect(url, {
        useUnifiedTopology: true
    })
    const database = connection.db()
    console.log('Connected to db.')

    return database
}

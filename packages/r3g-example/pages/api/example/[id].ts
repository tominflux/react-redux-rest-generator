import generateApiHandler from 'utils/generateApiHandler'
import ExampleModel from 'models/example'

export default generateApiHandler({
    put: async (req, res, db) => {
        const { id } = req.query
        const key = id as string
        const { ...example } = req.body

        const { status, message, payload } = await ExampleModel.update(db, { key }, { ...example })

        const responseBody = { message, payload }
        res.status(status).json(responseBody)
        return true
    },
    delete: async (req, res, db) => {
        const { id } = req.query
        const key = id as string

        const { status, message, payload } = await ExampleModel.delete(db, { key })

        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE, OPTIONS')
        res.status(status).json({ message, payload })
        return true
    }
})

import generateApiHandler from 'utils/generateApiHandler'
import ExampleModel from 'models/example'

export default generateApiHandler({
    put: async (req, res, db) => {
        const { id } = req.query
        const key = id as string
        const { ...example } = req.body

        const { status, message, payload } = await ExampleModel.update(db, { key }, { ...example })

        res.status(status).json({ message, payload })
    },
    delete: async (req, res, db) => {
        const { id } = req.query
        const key = id as string

        const { status, message, payload } = await ExampleModel.delete(db, { key })

        res.status(status).json({ message, payload })
    }
})

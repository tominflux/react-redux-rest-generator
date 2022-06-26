import generateApiHandler from 'utils/generateApiHandler'
import ExampleModel from 'models/example'

export default generateApiHandler({
    post: async (req, res, db) => {
        const createData = req.body

        const { status, message, payload } = await ExampleModel.create(db, createData)

        res.status(status).json({ message, payload })
        return true
    },
    get: async (req, res, db) => {
        const readParams = req.query

        const { status, message, payload } = await ExampleModel.read(db, readParams)

        res.status(status).json({ message, payload })
        return true
    }
})

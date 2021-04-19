import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'utils/database'

/**
 * Wraps request handler in boilerplate, ensuring mongo connection is established.
 */
const wrapRequestHandler: ApiRequestHandlerWrapper = (requestHandler: ApiRequestHandler) => {
    const wrappedHandler: WrappedRequestHandler = async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {
        // Ensure mongo connection established.
        const db = await connectToDatabase()

        // ~Insert any other boilerplate here~

        try {
            await requestHandler(req, res, db)
        } catch (err) {
            console.error(`Server error when handling ${req.method} - ${req.url}`)
            console.error(err)
            res.status(500).json({ message: 'Unknown error occurred', payload: null })
        }
    }
    return wrappedHandler
}

/**
 * Converts an API config into an Array of API Method Handlers.
 */
const generateMethodHandlers: ApiMethodHandlersGenerator = (apiConfig) =>
    Object.keys(apiConfig).map((key) => {
        // Convert config object key into method identifier (e.g 'POST').
        const method = key.toUpperCase() as ApiMethod

        // Get the handler function from the config.
        const handler = apiConfig[key] as ApiRequestHandler

        // Wrap the handler in boilerplate.
        const wrappedHandler = wrapRequestHandler(handler)

        // Create method handler object from key and function.
        const methodHandler: ApiMethodHandler = {
            method,
            handler: wrappedHandler
        }

        return methodHandler
    })

/**
 * Recursively iterate over methods handlers, executing against
 * request if a method match is found.
 */
const handleMethods: ApiMethodsIterator = async (req, res, methodHandlers) => {
    // If no method handlers left, then no methods have been handled.
    // Return false to indicate need for a 405 response.
    if (methodHandlers.length === 0) {
        return false
    }

    // Check if current handler's method matches that of request.
    const currentMethod = methodHandlers[0]
    if (req.method.toUpperCase() === currentMethod.method) {
        // Execute handler.
        await currentMethod.handler(req, res)
        // Return true to indicate request has been handled.
        return true
    }

    // Iterate to next handler.
    return handleMethods(req, res, methodHandlers.slice(1))
}

const generateApiHandler: ApiHandlerGenerator = (apiConfig) => {
    const apiHandler: ApiRequestHandler = async (req, res) => {
        try {
            // Generate method handler objects from api config.
            const methodHandlers = generateMethodHandlers(apiConfig)

            // Recursively iterate over methods handlers, executing against
            // request if a method match is found.
            const reqWasHandled = await handleMethods(req, res, methodHandlers)

            // If method not handled, send back a 405.
            if (!reqWasHandled) {
                const allow = methodHandlers.map((methodHandler) => methodHandler.method)
                res.setHeader('Allow', allow)
                res.status(405).end()
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }

    return apiHandler
}

export default generateApiHandler

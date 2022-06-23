import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'utils/database'

/**
 * Wraps request handler in boilerplate, ensuring mongo connection is established.
 */
const wrapRequestHandler: ApiRequestHandlerWrapper = (
    requestHandler: ApiRequestHandler,
    id: string
) => {
    const wrappedHandler: WrappedRequestHandler = async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {
        // Ensure mongo connection established.
        const db = await connectToDatabase()

        // ~Insert any other boilerplate here~

        try {
            const wasHandled = (await requestHandler(req, res, db)) ?? true
            return wasHandled
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Unknown error occurred', payload: null })
            const wasHandled = true
            return wasHandled
        }
    }
    return wrappedHandler
}

/**
 * Converts an API config into an Array of API Method Handlers.
 */
const generateMethodHandlers: ApiMethodHandlersGenerator = (apiConfig, id) =>
    Object.keys(apiConfig).map((key) => {
        // Convert config object key into method identifier (e.g 'POST').
        const method = key.toUpperCase() as ApiMethod

        // Get the handler function from the config.
        const handler = apiConfig[key] as ApiRequestHandler

        // Wrap the handler in boilerplate.
        const wrappedHandler = wrapRequestHandler(handler, id)

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
        /*
        // Set 'Access-Control-Allow-Methods' header to explicitly
        // only allow required methods for resource (rather than wildcard '*').
        const allow = methodHandlers.map((methodHandler) => methodHandler.method)
        res.setHeader('Access-Control-Allow-Methods', allow)
        */
        // Execute handler.
        const wasHandled = await currentMethod.handler(req, res)
        // Return boolean to indicate if request has been handled.
        return wasHandled ?? true
    }

    // Iterate to next handler.
    return handleMethods(req, res, methodHandlers.slice(1))
}

const generateApiHandler: ApiHandlerGenerator = (apiConfig) => {
    const apiHandler: NextApiRequestHandler = async (req, res) => {
        const id = new Date().toISOString()
        try {
            // Generate method handler objects from api config.
            const methodHandlers = generateMethodHandlers(apiConfig, id)
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

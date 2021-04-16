type ApiMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

type ApiResponse = {
    message: string
    data?: any
}

type ApiRequestHandler = (req: NextApiRequest, res: NextApiResponse, db: Db) => Promise<void>

type WrappedRequestHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

type ApiConfig = {
    post?: ApiRequestHandler
    get?: ApiRequestHandler
    put?: ApiRequestHandler
    patch?: ApiRequestHandler
    delete?: ApiRequestHandler
}

type ApiMethodHandler = {
    method: ApiMethod
    handler: WrappedRequestHandler
}

type ApiRequestHandlerWrapper = (handler: ApiRequestHandler) => WrappedRequestHandler

type ApiMethodHandlersGenerator = (apiConfig: ApiConfig) => Array<ApiMethodHandler>

type ApiMethodsIterator = (
    req: NextApiRequest,
    res: NextApiResponse,
    methods: Array<ApiMethodHandler>
) => Promise<boolean>

type ApiHandlerGenerator = (apiConfig: ApiConfig) => ApiRequestHandler

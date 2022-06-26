type ApiMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

type ApiResponse = {
    message: string
    data?: any
}

type NextApiRequestHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

type ApiRequestHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    db: Db
) => Promise<boolean | undefined>

type WrappedRequestHandler = (
    req: NextApiRequest,
    res: NextApiResponse
) => Promise<boolean | undefined>

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

type ApiRequestHandlerWrapper = (handler: ApiRequestHandler, id: string) => WrappedRequestHandler

type ApiMethodHandlersGenerator = (apiConfig: ApiConfig, id: string) => Array<ApiMethodHandler>

type ApiMethodsIterator = (
    req: NextApiRequest,
    res: NextApiResponse,
    methods: Array<ApiMethodHandler>
) => Promise<boolean>

type ApiHandlerGenerator = (apiConfig: ApiConfig) => NextApiRequestHandler

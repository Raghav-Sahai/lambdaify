import { Route, Param } from './types/router.types'
import {
    standardizeEvent,
    StandardizedEvent,
    standardizeContext,
    StandardizedContext,
} from './utils/standardize'
import { Request } from './Request'
import { Response } from './Response'
import { router } from './Router'

const { log, error } = console

const ROUTE_NOT_FOUND = new Error('This route does not exist')
const UNEXPECTED_ERROR = new Error('Unexpected error')

const lambdaify = options => {
    options = options || {}
    if (typeof options !== 'object')
        throw new Error('Options must be an object')

    // Initialize router
    const Router = router({})

    //Public API
    const lambdaify = {
        // TODO: Have this be either APIGateway v1, v2, or alb
        run: async (event, context) => {
            log('lambdaify::run()')

            // Standardize event
            const standardEvent: StandardizedEvent = standardizeEvent(event)
            const standardContext: StandardizedContext =
                standardizeContext(context)

            // Extract method and path from event
            const { method, path } = standardEvent

            // Find route in router, return matched route
            const matchedRoute: Route = Router.matchedRoute(method, path)

            // TODO: Need to have this return 404 response
            if (!matchedRoute) throw ROUTE_NOT_FOUND

            // Extract route callback and params object
            const { callback, params } = matchedRoute

            try {
                return await handleRun(
                    standardEvent,
                    standardContext,
                    callback,
                    params
                )
            } catch (err) {
                // TODO: Need to have this return some kind of error response
                error(err)
                throw UNEXPECTED_ERROR
            }
        },
        get: (path: string, callback) =>
            Router.registerRoute('GET', path, callback),
        put: (path: string, callback) =>
            Router.registerRoute('PUT', path, callback),
        post: (path: string, callback) =>
            Router.registerRoute('POST', path, callback),
        delete: (path: string, callback) =>
            Router.registerRoute('DELETE', path, callback),
        router: () => Router.getRouter(), // For test purposes
    }

    return lambdaify
}

const handleRun = async (
    event: StandardizedEvent,
    context: StandardizedContext,
    callback,
    params: Array<Param>
) => {
    log('lambdaify::handleRun()')

    // Create request and response references
    const request = new Request(event, context, params)
    const response = new Response(event, context)

    try {
        await callback(request, response)
        return response.createResponse()
    } catch (err) {
        error(err)
        return formatError(err)
    }
}
const formatError = (error: Error) => {
    return {
        statusCode: 400,
        headers: {
            'Content-Type': 'text/plain',
            'x-amzn-ErrorType': 400,
        },
        isBase64Encoded: false,
        body: error.message,
    }
}

export { lambdaify }
module.exports = lambdaify
module.exports.lambdaify = lambdaify
module.exports.default = lambdaify

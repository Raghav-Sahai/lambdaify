import {
    APIGatewayEventRequestContextV2,
} from 'aws-lambda';
import { Request } from './Request'
import { Response } from './Response'
import { router } from './Router'
import { Route, RouteParams } from './types/Router.types'
import { standardizeEvent, StandardizedEvent } from './utils/standardizeEvent'


const { log, error } = console
const routeNotFound = new Error('This route does not exist')
const unexpectedError = new Error('Unexpected error')

const lambdaify = (options: Object) => {

    options = options || {}
    if (typeof options !== 'object') {
        throw new Error('Options must be an object')
    }

    // Initialize router
    const Router = router()

    //Public API
    const lambdaify = {

        // TODO: Have this be either APIGateway v1, v2, or alb
        run: async (event: any, context: any):Promise<any> => {
            log('run')

            // Standardize event
            const standardEvent: StandardizedEvent = standardizeEvent(event)

            // Extract method and path from event
            const { method, path } = standardEvent

            // Find route in router, return matched route
            const matchedRoute: Route = Router.matchedRoute(method, path)

            // TODO: Need to have this return 404 response
            if (!matchedRoute) throw routeNotFound

            // Extract route callback and params object
            const { callback, params } = matchedRoute

            try {
                await handleRun(standardEvent, context, callback, params)
            } catch (error) {
                // TODO: Need to have this return some kind of error response
                error(error)
                throw unexpectedError
            }
        },
        get: ( path: String, callback: Function):any => {
            log('get')
            Router.registerRoute('GET', path, callback)
        },
        put: (path: String, callback: Function):any => {
            log('put')
            Router.registerRoute('PUT', path, callback)
        },
        post: (path: String, callback: Function):any => {
            log('post')
            Router.registerRoute('POST', path, callback)
        },
        delete: (path: String, callback: Function):any => {
            log('delete')
            Router.registerRoute('DELETE', path, callback)
        },
        router: () => Router.getRouter() // For test purposes
    }    

    return lambdaify
}

const handleRun = async (event: StandardizedEvent, context: APIGatewayEventRequestContextV2, callback: Function, params: RouteParams): Promise<any> => {
    log('handleRun')

    const request = Request(event, context, params)
    const response = Response(event, context)
    try {
        return await callback(request, response)
    } catch (error) {

        // TODO: Need to have this return some kind of error response
        throw error
    }

}

module.exports = lambdaify
module.exports.lambdaify = lambdaify
module.exports.default = lambdaify

import {
    APIGatewayProxyEventV2,
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2
} from 'aws-lambda';
import { Request } from './Request'
import { Response } from './Response'
import { router, Route } from './Router'

const { log, error } = console

const lambdaify = (options: Object) => {

    options = options || {}
    if (typeof options !== 'object') {
        throw new TypeError('Options must be an object')
    }

    const Router = router()

    //Public API
    const lambdaify = {

        // TODO: replace any with 'APIGatewayProxyStructuredResultV2'
        run: async (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2):Promise<any> => {
            log('run')

            // Find route in router, Return callback
            // TODO: handle error case if no route is found, func throws error...
            const matchedRoute: Route = Router.matchedRoute(event)
            const { callback } = matchedRoute
            await handleRun(event, context, callback)
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

const handleRun = async (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2, callback: Function): Promise<any> => {
    log('handleRun')

    const request = Request(event)
    const response = Response(event, context)
    try {
        return await callback(request, response)
    } catch (error) {
        throw error
    }

}

module.exports = lambdaify
module.exports.lambdaify = lambdaify
module.exports.default = lambdaify

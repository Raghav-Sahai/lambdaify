import {
    APIGatewayProxyEventV2,
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2
} from 'aws-lambda';
import { Request } from './Request'
import { Response } from './Response'
import { Router } from './Router'

const { log, error } = console

const lambdaify = (options: Object) => {

    options = options || {}
    if (typeof options !== 'object') {
        throw new TypeError('Options must be an object')
    }

    const router = Router()

    //Public API
    const lambdaify = {

        // TODO: replace any with 'APIGatewayProxyStructuredResultV2'
        run: async (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2):Promise<any> => {
            log('run')

            // Find route in router, Return callback
            const callback: Function = router.getCallback(event)
            await handleRun(event, context, callback)
        },
        get: ( path: String, callback: Function):any => {
            log('get')
            router.registerRoute('GET', path, callback)
        },
        put: (path: String, callback: Function):any => {
            log('put')
            router.registerRoute('PUT', path, callback)
        },
        post: (path: String, callback: Function):any => {
            log('post')
            router.registerRoute('POST', path, callback)
        },
        delete: (path: String, callback: Function):any => {
            log('delete')
            router.registerRoute('DELETE', path, callback)
        },
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

import {
    APIGatewayProxyEventV2,
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2
} from 'aws-lambda';
import { Request } from './Request'
import { Response } from './Response'

const { log, error } = console

const lambdaify = (options: any) => {

    options = options || {}
    if (typeof options !== 'object') {
        throw new TypeError('Options must be an object')
    }

    // CreateRouter()

    //Public API
    const lambdaify = {

        // TODO: replace any with 'APIGatewayProxyStructuredResultV2'
        run: async (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2):Promise<any> => {
            log('run')

            // Find route in router, Return callback
            
            await handleRun(event, context, callback)
        },
        get: (path: String, callback: Function):any => {
            log('get')
            // register route in router
        },
        put: (path: String, callback: Function):any => {
            log('put')
            // register route in router
        },
        post: (path: String, callback: Function):any => {
            log('post')
            // register route in router
        },
        delete: (path: String, callback: Function):any => {
            log('delete')
            // register route in router
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

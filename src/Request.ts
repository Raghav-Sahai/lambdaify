import { APIGatewayEventRequestContextV2 } from 'aws-lambda';
import { StandardizedEvent } from './utils/standardizeEvent'
import { RouteParams } from './types/Router.types'
import { getPathArray } from './utils/parsePath'

const Request = (
    event:StandardizedEvent,
    context: APIGatewayEventRequestContextV2,
    params: RouteParams): any => {
    const paramsObject = parseParams(event.path, params)
    // Public request API
    const request = {
        version: event.payloadVersion,
        body: event.body,
        headers: event.headers,
        path: event.path,
        method: event.method,
        isBase64Encoded: event.isBase64Encoded,
        querystringParameters: event.querystringParameters,
        params: paramsObject
    }
    return request
}

const parseParams = (path: string, params: RouteParams): any => {
    if (!params) return {}
    
    let paramsObject: any = {}
    const pathArray = getPathArray(path)
    params.forEach((param) =>  paramsObject[param.key] = pathArray[param.index])

    return paramsObject
}

export { Request }

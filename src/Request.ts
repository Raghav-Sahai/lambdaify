import {
    APIGatewayEventRequestContextV2
} from 'aws-lambda';
import { StandardizedEvent } from './utils/standardizeEvent'

const Request = (event:StandardizedEvent, context: APIGatewayEventRequestContextV2, params: any): any => {
    // Public request API
    const request = {
        body: () => event.body || undefined,
        headers: () => event.headers,
        queryStringParameters: () => event.queryStringParameters || {},
    }
    return request
}

export { Request }

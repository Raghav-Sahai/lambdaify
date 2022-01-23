import {
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2
} from 'aws-lambda';
import { StandardizedEvent } from './utils/standardizeEvent'
import { json } from 'stream/consumers';

const Response = (event: StandardizedEvent, context: APIGatewayEventRequestContextV2): any => {

    let isBase64Encoded: Boolean = false
    let statusCode: number = 200
    let headers: any = {}
    let body: any = ''

    // Public response API
    // TODO: Create functions to update response functions
    const response = {
        status: (code: number): any => setStatusCode(code),
        header: (key: string, value: string): any => setHeader(key, value),
        send: (body: any): object => setBody(body),
    }
    
    // See: https://github.com/jeremydaly/lambda-api/blob/main/lib/response.js#L72
    const setHeader = (key: string, value: string) => {
        let _key = key.toLowerCase(); // store as lowercase
        let _values = value ? (Array.isArray(value) ? value : [value]) : [''];
    
        headers[_key] = _values
        return createResponse()
    }

    const setStatusCode = (code: number) => {
        statusCode = code
        return createResponse()
    }

    const setBody = (body: any) => {
        body = JSON.stringify(body)
        return createResponse()
    }

    const createResponse = () => {
        return {
            isBase64Encoded,
            statusCode,
            headers,
            body
        }
    }

    return response
}



export { Response }
import {
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2
} from 'aws-lambda';
import { StandardizedEvent } from './utils/standardizeEvent'

const Response = (event: StandardizedEvent, context: APIGatewayEventRequestContextV2): any => {

    let isBase64Encoded: Boolean = false
    let statusCode: number = 200
    let body: any = {}
    let headers: any = {}

    // Public response API
    // TODO: Create functions to update response functions
    const response = {
        status: (code: number) : any => setStatusCode(code),
        send: (body: any): any => {},
        header: (key: string, value: string): any => setHeader(key, value)
    }
    
    // See: https://github.com/jeremydaly/lambda-api/blob/main/lib/response.js#L72
    const setHeader = (key: string, value: string) => {
        let _key = key.toLowerCase(); // store as lowercase
        let _values = value ? (Array.isArray(value) ? value : [value]) : [''];
    
        headers[_key] = _values
        return headers
    }

    const setStatusCode = (code: number) => statusCode = code

    return response
}



export { Response }
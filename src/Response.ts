import {
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2,
    APIGatewayProxyResult,
    APIGatewayProxyResultV2 ,
    ALBResult
} from 'aws-lambda';
import { StandardizedEvent } from './utils/standardizeEvent'

const Response = (event: StandardizedEvent, context: APIGatewayEventRequestContextV2): any => {

    let multiValueHeaders: any = {}
    let cookies: Array<string> = []
    let isBase64Encoded: boolean = false
    let statusCode: number = 200
    let headers: any = {}
    let body: any = ''

    // Public response API
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

    const setBody = (_body: any) => {
        body = JSON.stringify(_body)
        return createResponse()
    }

    const createResponse = (): any => {
        const payloadVersion = event.payloadVersion

        if (payloadVersion === "alb") {
            const response: ALBResult = {
                isBase64Encoded,
                statusCode,
                headers,
                body,
                statusDescription: getStatusDescription(statusCode)
            }
            return response
        } else if (payloadVersion === "gatewayV1.0") {
            const response: APIGatewayProxyResult = {
                isBase64Encoded,
                statusCode,
                headers,
                body,
                multiValueHeaders
            }
            return response
        } else if (payloadVersion ==="gatewayV2.0") {
            const response: APIGatewayProxyResultV2 = {
                isBase64Encoded,
                statusCode,
                headers,
                body,
                cookies
            }
            return response
        }
    }

    return response
}

const getStatusDescription = (statusCode: number): string | undefined => {
    // TODO add logic for this
    return ''
}

export { Response }
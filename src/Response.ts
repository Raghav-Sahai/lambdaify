import {
    APIGatewayProxyResult,
    APIGatewayProxyResultV2 ,
    ALBResult
} from 'aws-lambda';
import {
    StandardizedEvent,
    StandardizedContext
} from './utils/standardize';
import { getStatusDescription } from './utils/statusCodes';

function Response (_event: StandardizedEvent, context: StandardizedContext) {
    this.event = _event
    this.context = context
    this.isResponseSent = false
    this.multiValueHeaders = {}
    this.cookies = []
    this.isBase64Encoded = false
    this.statusCode = 200
    this.headers = {}
    this.body = null
    this.serializer = null
    this.createResponse = (): any => {
        const payloadVersion = this.event.payloadVersion
        if (payloadVersion === "alb") {
            const response: ALBResult = {
                isBase64Encoded: this.isBase64Encoded,
                statusCode: this.statusCode,
                headers: this.headers,
                body: serialize(this.body, this.serializer),
                statusDescription: getStatusDescription(this.statusCode)
            }
            return response
        } else if (payloadVersion === "gatewayV1.0") {
            const response: APIGatewayProxyResult = {
                isBase64Encoded: this.isBase64Encoded,
                statusCode:  this.statusCode,
                headers: this.headers,
                body: serialize(this.body, this.serializer),
                multiValueHeaders: this.multiValueHeaders
            }
            return response
        } else if (payloadVersion ==="gatewayV2.0") {
            const response: APIGatewayProxyResultV2 = {
                isBase64Encoded: this.isBase64Encoded,
                statusCode: this.statusCode,
                headers: this.headers,
                body: serialize(this.body, this.serializer),
                cookies: this.cookies
            }
            return response
        }
    }
}

// send
Response.prototype.send = function (body: any) {
    if (this.isResponseSent) throw new Error("Response was already sent")
    this.body = body

    this.isResponseSent = true
    return this
}

// set cookie
Response.prototype.cookie = function (cookie: string) {
    this.cookies.push(cookie)

    return this
}

// sets header
Response.prototype.header = function (key: string, value: Array<string> | string) {
    const _key = key.toLowerCase()

    value = value === undefined ? '' : value

    if (Array.isArray(value)) { 
        this.multiValueHeaders[_key] = value 
    } else if (typeof value === "string") {
        this.headers[_key] = value
    }
    
    return this
}

// sets serializer
Response.prototype.serializer = function (fn) {
    this.serializer = fn

    return this
}

// sets status codes
Response.prototype.code = function (code) {
    const intValue = parseInt(code)
    if (isNaN(intValue) || intValue < 100 || intValue > 600) {
        throw new Error("code must be an integer");
    }
    this.statusCode = intValue

    return this
}
Response.prototype.status = Response.prototype.code

const serialize = (body: any, serializer: any): any => {
    const encoding = typeof serializer === 'function' ? serializer : JSON.stringify;
    if (typeof body === "object") {
        return encoding(body)
    } else if (typeof body !== "string") {
        return body.toString()
    }
    return body
}

export { Response }
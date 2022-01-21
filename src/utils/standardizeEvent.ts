import {
    APIGatewayProxyEventV2,
    APIGatewayProxyEvent,
    ALBEvent,
} from 'aws-lambda';
import { Method } from '../types/Router.types'

interface StandardizedEvent {
    payloadVersion?: string,
    method: Method
    path: string,
    headers?: Object,
    isBase64Encoded: boolean
    body?: any
    queryStringParameters?: Object | null
}

const unrecognizedEventTypeError = new Error("Unrecognized event type")

const standardizeEvent = (event: any) => {

    const eventType: string = event.requestContext.elb ? 'alb' : 'APIGateway'

    // If alb event
    if (eventType === 'alb') { 
        const albEvent: ALBEvent = {...event}
        return standardizeAlbEvent(albEvent)
    }

    //If gateway event
    const APIGatewayVersion: string = event.version
    if (APIGatewayVersion === "2.0") {
        const gatewayV2Event: APIGatewayProxyEventV2 = {...event}
        return standardizeGatewayV2Event(gatewayV2Event)
    } else if (APIGatewayVersion === "1.0") {
        const gatewayV1Event: APIGatewayProxyEvent = {...event}
        return standardizeGatewayV1Event(gatewayV1Event)
    }

    throw unrecognizedEventTypeError

}

const standardizeAlbEvent = (event: ALBEvent): StandardizedEvent => {
    const payloadVersion = undefined
    const method = event.httpMethod.toUpperCase() as Method
    const path = event.path
    const headers = event.headers
    const isBase64Encoded = event.isBase64Encoded
    const queryStringParameters = event.queryStringParameters

    return {
        payloadVersion,
        method,
        path,
        headers,
        isBase64Encoded,
        queryStringParameters
    }
}

const standardizeGatewayV2Event = (event: APIGatewayProxyEventV2): StandardizedEvent => {
    const payloadVersion = event.version
    const method = event.requestContext.http.method as Method
    const path = event.requestContext.http.path
    const headers = event.headers
    const isBase64Encoded = event.isBase64Encoded
    const queryStringParameters = event.queryStringParameters

    return {
        payloadVersion,
        method,
        path,
        headers,
        isBase64Encoded,
        queryStringParameters
    }
}

const standardizeGatewayV1Event = (event: APIGatewayProxyEvent): StandardizedEvent => {
    const payloadVersion = "1.0"
    const method = event.httpMethod as Method
    const path = event.path
    const headers = event.headers
    const isBase64Encoded = event.isBase64Encoded
    const queryStringParameters = event.queryStringParameters
    
    return {
        payloadVersion,
        method,
        path,
        headers,
        isBase64Encoded,
        queryStringParameters
    }
}

export { standardizeEvent, StandardizedEvent }

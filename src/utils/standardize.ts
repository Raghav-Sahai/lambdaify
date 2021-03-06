import {
    APIGatewayProxyEventV2,
    APIGatewayProxyEvent,
    ALBEvent,
} from 'aws-lambda';
import { Method } from '../types/router.types';
import { decodeBase64 } from './base64';

type PayloadVersion = 'alb' | 'gatewayV1.0' | 'gatewayV2.0';
interface StandardizedEvent {
    payloadVersion: PayloadVersion;
    raw;
    method: Method;
    path: string;
    headers?;
    isBase64Encoded: boolean;
    body;
    querystringParameters?;
}

// TODO: Add standard context logic
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StandardizedContext {}

const unrecognizedEventTypeError = new Error(
    'Unrecognized event type, events must be from API Gateway V1, API Gateway V2, or alb'
);

const standardizeContext = (context): StandardizedContext => {
    return context;
};

const standardizeEvent = event => {
    const eventType: string = event.requestContext.elb ? 'alb' : 'APIGateway';

    // If alb event
    if (eventType === 'alb') {
        const albEvent: ALBEvent = { ...event };
        return standardizeAlbEvent(albEvent);
    }

    //If gateway event
    const APIGatewayVersion: string = event.version;
    if (APIGatewayVersion === '2.0') {
        const gatewayV2Event: APIGatewayProxyEventV2 = { ...event };
        return standardizeGatewayV2Event(gatewayV2Event);
    } else if (APIGatewayVersion === '1.0') {
        const gatewayV1Event: APIGatewayProxyEvent = { ...event };
        return standardizeGatewayV1Event(gatewayV1Event);
    }

    throw unrecognizedEventTypeError;
};

const standardizeAlbEvent = (event: ALBEvent): StandardizedEvent => {
    const payloadVersion = 'alb';
    const raw = event;
    const method = event.httpMethod.toUpperCase() as Method;
    const path = event.path;
    const headers = event.headers;
    const isBase64Encoded = event.isBase64Encoded;
    const body = isBase64Encoded ? decodeBase64(event.body) : event.body;
    const querystringParameters = event.queryStringParameters;

    return {
        payloadVersion,
        raw,
        method,
        path,
        headers,
        isBase64Encoded,
        body,
        querystringParameters,
    };
};

const standardizeGatewayV2Event = (
    event: APIGatewayProxyEventV2
): StandardizedEvent => {
    const payloadVersion = 'gatewayV2.0';
    const raw = event;
    const method = event.requestContext.http.method as Method;
    const path = event.requestContext.http.path;
    const headers = event.headers;
    const isBase64Encoded = event.isBase64Encoded;
    const body = isBase64Encoded ? decodeBase64(event.body) : event.body;
    const querystringParameters = event.queryStringParameters;

    return {
        payloadVersion,
        raw,
        method,
        path,
        headers,
        isBase64Encoded,
        body,
        querystringParameters,
    };
};

const standardizeGatewayV1Event = (
    event: APIGatewayProxyEvent
): StandardizedEvent => {
    const payloadVersion = 'gatewayV1.0';
    const raw = event;
    const method = event.httpMethod as Method;
    const path = event.path;
    const headers = { ...event.headers, ...event.multiValueHeaders };
    const isBase64Encoded = event.isBase64Encoded;
    const body = isBase64Encoded ? decodeBase64(event.body) : event.body;
    const querystringParameters = {
        ...event.queryStringParameters,
        ...event.multiValueQueryStringParameters,
    };

    return {
        payloadVersion,
        raw,
        method,
        path,
        headers,
        isBase64Encoded,
        body,
        querystringParameters,
    };
};

export {
    standardizeEvent,
    StandardizedEvent,
    standardizeContext,
    StandardizedContext,
};

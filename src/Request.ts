import {
    APIGatewayProxyEventV2,
    APIGatewayEventRequestContextV2
} from 'aws-lambda';

const Request = (event:APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2, params: any): any => {
    // Public request API
    const request = {
        body: () => event.body || undefined,
        headers: () => event.headers,
        cookies: () => event.cookies || [],
        queryStringParameters: () => event.queryStringParameters || {},
        pathParameters: () => event.pathParameters || {},
        rawPath: () => event.rawPath
    }
    return request
}

export { Request }

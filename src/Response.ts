import {
    APIGatewayProxyEventV2,
    APIGatewayEventRequestContextV2,
    APIGatewayProxyStructuredResultV2
} from 'aws-lambda';

const Response = (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2): APIGatewayProxyStructuredResultV2 => {

    let isBase64Encoded: Boolean = false
    let statusCode: Number = 200
    let body: any = {}
    let headers: Object = {}

    // Default response
    let lambdaResponse = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "body": "",
        "headers": {
          "content-type": "application/json"
        }
    }

    // Public response API
    // TODO: Create functions to update response functions
    const response = {
        statusCode: (statusCode: Number): any => lambdaResponse,
        send: (body: any): any => lambdaResponse,
        header: (key: String, value: String): any => lambdaResponse 
    }

    return lambdaResponse
}

export { Response }
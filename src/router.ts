import {
    APIGatewayProxyEventV2,
} from 'aws-lambda';

const Router = () => {
    let router = []
    return {
        registerRoute: (path: String, callback: Function): any => {},
        getCallback: (event: APIGatewayProxyEventV2): Function => () => {}
    }
}

export { Router }
import {
    APIGatewayProxyEventV2,
} from 'aws-lambda';

type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'
interface Param {
    key: String,
    index: Number
}
interface RouteParams extends Array<Param>{}
interface Route {
    method: Method,
    rawPath: String,
    fragmentLength: Number,
    params: RouteParams,
    nonParamsIndex: Array<Number>,
    callback: Function
}
interface Router extends Array<Route>{}

const Router = () => {
    let router: Router = []

    // Private router API
    return {
        registerRoute: (method: Method, path: String, callback: Function): any => {
            const route: Route = {
                method,
                rawPath: path,
                fragmentLength: 1, // update
                params: [], // update
                nonParamsIndex: [], // update
                callback
            }
            router.push(route)
            return router
        },
        getCallback: (event: APIGatewayProxyEventV2): Function => () => {}
    }
}

export { Router }
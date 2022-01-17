import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { parsePath } from './utils/parsePath';
import { findRoute } from './utils/findRoute'

interface Param {
    key: String,
    index: Number
}
interface Route {
    method: Method,
    path: String,
    pathArray: Array<string>
    fragmentLength: Number,
    params: RouteParams,
    nonParamsIndex: Array<Number>,
    callback: Function
}
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'
interface RouteParams extends Array<Param>{}
interface Router extends Array<Route>{}

const router = (): any => {
    let router: Router = []

    // Private router API
    return {
        registerRoute: (method: Method, path: String, callback: Function ): Router => {
            const { fragmentLength, params, nonParamsIndex, pathArray } = parsePath(path)
            const route: Route = {
                method,
                path,
                pathArray,
                fragmentLength,
                params,
                nonParamsIndex,
                callback
            }
            router.push(route)
            return router
        },
        getCallback: (event: APIGatewayProxyEventV2): any => {
            const incomingPath = event.requestContext.http.path
            const incomingMethod = event.requestContext.http.method
            const { fragmentLength, nonParamsIndex, pathArray } = parsePath(incomingPath)
            const callback = findRoute(router, fragmentLength, nonParamsIndex, pathArray, incomingMethod as Method)
        },
        getRouter: () => console.log(JSON.stringify(router)) // Here for test purposes
    }
}

export { 
    router,
    Param,
    RouteParams,
    Router,
    Method
 }
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { parsePath } from './utils/parsePath'

interface Param {
    key: String,
    index: Number
}
interface Route {
    method: Method,
    path: String,
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
            const { fragmentLength, params, nonParamsIndex } = parsePath(path)
            const route: Route = {
                method,
                callback,
                path,
                fragmentLength,
                params,
                nonParamsIndex
            }
            router.push(route)
            return router
        },
        getCallback: (event: APIGatewayProxyEventV2): Function => () => {},
        getRouter: () => console.log(router) // Here for test purposes
    }
}

export { 
    router,
    Param,
    RouteParams
 }
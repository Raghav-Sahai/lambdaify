import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { parsePath } from './utils/parsePath';
import { matchRoute } from './utils/matchRoute'

interface Param {
    key: String,
    index: number
}
interface Route {
    method: Method,
    path: String,
    pathArray: Array<string>
    params: RouteParams,
    callback: Function
}
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'
interface RouteParams extends Array<Param>{}
interface Router extends Array<Route>{}

const routeNotFound = new Error('This route does not exist')

const router = (): any => {
    let router: Router = []

    // Private router API
    return {
        registerRoute: (method: Method, path: String, callback: Function ): Router => {
            const { params, pathArray } = parsePath(path)
            const route: Route = {
                method,
                path,
                pathArray,
                params,
                callback
            }
            router.push(route)
            return router
        },
        matchedRoute: (event: APIGatewayProxyEventV2): any => {
            const incomingPath = event.requestContext.http.path
            const incomingMethod = event.requestContext.http.method
            const matchedRoute = matchRoute(router, incomingPath, incomingMethod as Method)

            if (!matchRoute) throw routeNotFound

            return matchRoute
        },
        getRouter: () => console.log(JSON.stringify(router)) // Here for test purposes
    }
}

export { 
    router,
    Param,
    RouteParams,
    Router,
    Route,
    Method
 }
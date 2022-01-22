interface Param {
    key: string,
    index: number
}
interface Route {
    method: Method,
    path: string,
    pathArray: Array<string>
    params: RouteParams,
    callback: Function
}
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'
interface RouteParams extends Array<Param>{}
interface Router extends Array<Route>{}

export {
    Param,
    Route,
    Method,
    RouteParams,
    Router
}

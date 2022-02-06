interface Param {
    key: string
    index: number
}
interface Route {
    method: Method
    path: string
    pathArray: Array<string>
    params: Array<Param>
    callback
}
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE'

export { Param, Route, Method }

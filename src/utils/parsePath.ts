import {
    Param,
    RouteParams
} from '../types/router.types'

const parsePath = (rawPath: string): { params: RouteParams, pathArray: Array<string> } => {

    // Extract path information
    const pathArray = getPathArray(rawPath)
    const params = getParams(pathArray)

    return { params, pathArray }
}
const getPathArray = (rawPath: string): Array<string> => {
    return rawPath
        ? rawPath
            .trim()
            .split('?')[0]
            .replace(/^\/(.*?)(\/)*$/, '$1') // IDK about this
            .split('/')
        : [];
}
const getParams = (pathArray: Array<string>): RouteParams => {
    let params: RouteParams = []

    pathArray.forEach((fragment, index) => {
        if (/^:(.*)$/.test(fragment)) {
            const param: Param = {
                key: fragment.substr(1),
                index
            }
            params.push(param)
        }
    })
    
    return params
}

export { parsePath, getPathArray }
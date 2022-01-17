import {
    Param,
    RouteParams
} from '../Router'

export const parsePath = (rawPath: String): { fragmentLength: Number, params: RouteParams, nonParamsIndex: Array<Number>, pathArray: Array<string> } => {
    const pathArray = getPathArray(rawPath)
    const fragmentLength = pathArray.length
    const { params, nonParamsIndex } = extractParams(pathArray)

    return { fragmentLength, params, nonParamsIndex, pathArray }
}
const getPathArray = (rawPath: String): Array<string> => {
    return rawPath
        ? rawPath
            .trim()
            .split('?')[0]
            .replace(/^\/(.*?)(\/)*$/, '$1') // IDK about this
            .split('/')
        : [];
}
const extractParams = (pathArray: Array<string>): { params: RouteParams, nonParamsIndex: Array<Number> } => {
    let params: RouteParams = []
    let nonParamsIndex: Array<Number> = []

    pathArray.forEach((fragment, index) => {
        if (/^:(.*)$/.test(fragment)) {
            const param: Param = {
                key: fragment.substr(1),
                index
            }
            params.push(param)
        } else {
            nonParamsIndex.push(index)
        }
    })
    
    return { params, nonParamsIndex }
}
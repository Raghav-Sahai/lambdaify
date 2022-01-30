import {
    Method,
    Route,
    Router
} from './types/router.types'
import {
    parsePath,
    getPathArray
} from './utils/parsePath'

const router = (options: object): any => {

    options = options || {}

    let router: Router = []

    // Private router API
    return {
        registerRoute: (method: Method, path: string, callback: Function ): Router => {
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
        matchedRoute: (method: Method, path: string): Route | {} => matchRoute(router, path, method as Method),
        getRouter: () => console.log(JSON.stringify(router)) // Here for test purposes
    }
}

const matchRoute = (router: Router, incomingPath: string, incomingMethod: Method): Route | {} => {
    
    // If no router, return
    if (!router) return {}

    // Get path arry for the incoming path
    const incomingPathArray = getPathArray(incomingPath)

    for (let route of router) {

        // Extract pathArray and params from route
        let { pathArray, params, method } = route

        // Make a copy of the incoming path array
        let refIncomingPathArray = [...incomingPathArray];

        (params).forEach(param => {

            // Replace the param index with filler variable
            pathArray[param.index] = '__var__'
            refIncomingPathArray[param.index] = '__var__'

        })

        // If the path arrays are the same, return the route
        if (equals(pathArray, refIncomingPathArray) && incomingMethod === method) return route    
    }

    return {}
}

const equals = (array1: Array<string>, array2: Array<string>): boolean => JSON.stringify(array1) === JSON.stringify(array2);

export { router }
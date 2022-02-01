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
        getRouter: (): Router => router
    }
}

const matchRoute = (router: Router, incomingPath: string, incomingMethod: Method): Route | {} => {
    
    // Get path arry for the incoming path
    const incomingPathArray = getPathArray(incomingPath)

    for (const route of router) {

        // Extract pathArray and params from route
        const { pathArray, params, method } = route

        // Make a copy of the path arrays
        const refRoutePathArray = [...pathArray]
        const refIncomingPathArray = [...incomingPathArray];

        (params).forEach(param => {

            // Replace the param index with filler variable
            refRoutePathArray[param.index] = '__var__'
            refIncomingPathArray[param.index] = '__var__'

        })

        // If the path arrays are the same, return the route
        if (equals(refRoutePathArray, refIncomingPathArray) && incomingMethod === method) return route    
    }

    return {}
}

const equals = (array1: Array<string>, array2: Array<string>): boolean => JSON.stringify(array1) === JSON.stringify(array2);

export { router }

// For tests
module.exports = router
module.exports.router = router
module.exports.default = router
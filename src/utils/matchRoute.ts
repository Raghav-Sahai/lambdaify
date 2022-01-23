import { 
    Router,
    Method, 
    Route 
} from '../types/Router.types'
import { getPathArray } from './parsePath'

const matchRoute = (router: Router, incomingPath: string, incomingMethod: Method): Route | {} => {

    // Filter for method
    const filteredRoutes: Router = router.filter( route => 
        route.method === incomingMethod
    )
    
    // If no matches, return throw error
    if (filteredRoutes.length === 0) return {}

    // Get path arry for the incoming path
    const incomingPathArray = getPathArray(incomingPath)

    for (let route of filteredRoutes) {

        // Extract pathArray and params from route
        let { pathArray, params } = route

        // Make a copy of the incoming path array
        let refIncomingPathArray = [...incomingPathArray];

        (params).forEach(param => {

            // Replace the param index with filler variable
            pathArray[param.index] = '__var__'
            refIncomingPathArray[param.index] = '__var__'

        })

        // If the path arrays are the same, return the route
        if (equals(pathArray, refIncomingPathArray)) return route    
    }

    return {}
}

const equals = (array1: Array<string>, array2: Array<string>): boolean => JSON.stringify(array1) === JSON.stringify(array2);

export { matchRoute }
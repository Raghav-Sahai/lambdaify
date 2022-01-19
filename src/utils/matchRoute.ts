import { Router, Method, Route } from '../Router'
import { getPathArray } from './parsePath'

const matchRoute = (router: Router, incomingPath: String, incomingMethod: Method): Route | [] => {

    // Filter for method
    const filteredRoutes: Router = router.filter( route => 
        route.method === incomingMethod
    )
    
    // IF no matches, return throw error
    if (filteredRoutes.length === 0) return []

    const incomingPathArray = getPathArray(incomingPath)

    for (const route of filteredRoutes) {
        const refIncomingPathArray = [...incomingPathArray];
        (route.params).forEach(param => {
            route.pathArray[param.index] = '__var__' // May have to make local copy
            refIncomingPathArray[param.index] = '__var__' // May have to make local copy
        })
        if (route.pathArray === refIncomingPathArray) return route    
    }

    return []
}

export { matchRoute }
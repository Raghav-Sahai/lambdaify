import { Router, Method, Route } from '../types/Router.types'
import { getPathArray } from './parsePath'

const matchRoute = (router: Router, incomingPath: String, incomingMethod: Method): Route | {} => {

    // Filter for method
    const filteredRoutes: Router = router.filter( route => 
        route.method === incomingMethod
    )
    
    // IF no matches, return throw error
    if (filteredRoutes.length === 0) return {}

    const incomingPathArray = getPathArray(incomingPath)

    for (let route of filteredRoutes) {
        let { pathArray, params } = route
        let refIncomingPathArray = [...incomingPathArray];
        (params).forEach(param => {
            pathArray[param.index] = '__var__'
            refIncomingPathArray[param.index] = '__var__'
        })

        if (pathArray === refIncomingPathArray) return route    
    }

    return {}
}

export { matchRoute }
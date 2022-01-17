import { Router, Method } from '../Router'
const routeNotFound = new Error('This route does not exist')

const findRoute = (router: Router, fragmentLength: Number, nonParamsIndex: Array<Number>, pathArray: Array<string>, incomingMethod: Method): any => {
    const filteredRoutes: Router = router.filter( route => 
        route.method === incomingMethod
    )
    
    if (filteredRoutes.length === 0) routeNotFound

    filteredRoutes.forEach(route => {

    })
}

export { findRoute }
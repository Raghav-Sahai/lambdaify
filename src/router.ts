import {
    Method,
    Route,
    Router
} from './types/router.types'
import { parsePath } from './utils/parsePath';
import { matchRoute } from './utils/matchRoute'

const router = (): any => {
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

export { router }
import {
    Method,
    Route,
    Router
} from './types/types'
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
        matchedRoute: (method: Method, path: string): Route | {} => {
            const incomingPath = path
            const incomingMethod = method
            const matchedRoute = matchRoute(router, incomingPath, incomingMethod as Method)

            return matchedRoute
        },
        getRouter: () => console.log(JSON.stringify(router)) // Here for test purposes
    }
}

export { router }
import { Method, Route } from './types/router.types';
import { getParams, getPathArray } from './utils/parsePath';

const ROUTE_ALREADY_EXISTS_ERROR = (method: Method, path: string) =>
    new Error(
        `${method} ${path} already exists and cannot be registered again.`
    );
const METHOD_PATH_EXTRACTION_ERROR = new Error(
    'Failed to parse event for method and path. Make sure your eventSource is set application load balancer'
);

const router = (options: object) => {
    const router: Array<Route> = [];

    // Router API
    return {
        registerRoute: (
            method: Method,
            path: string,
            callback
        ): Array<Route> => {
            const validateIfRouteExists = matchRoute(router, path, method);
            if (Object.keys(validateIfRouteExists).length !== 0) {
                throw ROUTE_ALREADY_EXISTS_ERROR(method, path);
            }

            const pathArray = getPathArray(path);
            const params = getParams(pathArray);
            const route: Route = {
                method,
                path,
                pathArray,
                params,
                callback,
            };
            router.push(route);
            return router;
        },
        matchedRoute: (event): Route => {
            const { method, path } = getRouteDetails(event);
            return matchRoute(router, path, method as Method);
        },
        getRouter: (): Array<Route> => router,
    };
};

const getRouteDetails = event => {
    const { httpMethod, path } = event;
    if (!httpMethod || !path) {
        throw METHOD_PATH_EXTRACTION_ERROR;
    }
    return { method: httpMethod, path };
};

const matchRoute = (
    router: Array<Route>,
    incomingPath: string,
    incomingMethod: Method
): Route => {
    const incomingPathArray = getPathArray(incomingPath);

    for (const route of router) {
        const { pathArray, params, method } = route;

        const refRoutePathArray = [...pathArray];
        const refIncomingPathArray = [...incomingPathArray];

        params.forEach(param => {
            refRoutePathArray[param.index] = '__var__';
            refIncomingPathArray[param.index] = '__var__';
        });

        if (
            equals(refRoutePathArray, refIncomingPathArray) &&
            incomingMethod.toUpperCase() === method.toUpperCase()
        )
            return route;
    }

    return {} as Route;
};

const equals = (array1: Array<string>, array2: Array<string>): boolean =>
    JSON.stringify(array1) === JSON.stringify(array2);

export { router };

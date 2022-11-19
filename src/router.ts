import { Request } from './Request';
import { Response } from './Response';
import { Method, Route } from './types/router.types';
import { getParams, getPathArray } from './utils/parsePath';

const ROUTE_ALREADY_EXISTS_ERROR = (method: Method, path: string) =>
    new Error(
        `${method} ${path} already exists and cannot be registered again.`
    );
const METHOD_PATH_EXTRACTION_ERROR = new Error(
    'Failed to parse event for method and path. Make sure your eventSource is set application load balancer'
);
const INVALID_MIDDLEWARE_PARAMS = (param: any) =>
    new Error(
        `Failed to register middleware: function must contain either 3 or 4 parameters, received ${param.length}`
    );
const INVALID_MIDDLEWARE_PARAMS_TYPE = (param: any) =>
    new Error(
        `Failed to register middleware: param must be of type function, received ${typeof param}`
    );
const INVALID_MIDDLEWARE_PARAMS_LENGTH = (param: any, expectedLength: number) =>
    new Error(
        `Failed to register middleware: expected ${expectedLength} params, received ${param.length}`
    );
const ROUTE_NOT_FOUND = new Error('Resource not found');

const router = (options: object) => {
    const router: Array<Route> = [];
    const middleware: Array<any> = [];
    const errorMiddleware: Array<any> = [];

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
        registerMiddleware: (...args) => {
            if (typeof args[0] === 'function') {
                const middlewareFn = args[0];
                if (args.length > 1) {
                    throw INVALID_MIDDLEWARE_PARAMS_LENGTH(args, 1);
                }
                if (middlewareFn.length !== 3 && middlewareFn.length !== 4) {
                    throw INVALID_MIDDLEWARE_PARAMS(middlewareFn);
                }
                const path = '/*';
                middleware.push({ middleware: middlewareFn, path });
            } else if (typeof args[0] === 'string') {
                const path = args[0];
                const middlewareFn = args[1];
                if (args.length > 2) {
                    throw INVALID_MIDDLEWARE_PARAMS_LENGTH(args, 2);
                }
                if (typeof middlewareFn !== 'function') {
                    throw INVALID_MIDDLEWARE_PARAMS_TYPE(middlewareFn);
                }
                if (middlewareFn.length !== 3 && middlewareFn.length !== 4) {
                    throw INVALID_MIDDLEWARE_PARAMS(middlewareFn);
                }
                middleware.push({ middleware: middlewareFn, path });
            } else {
                throw INVALID_MIDDLEWARE_PARAMS_TYPE(args[0]);
            }
        },
        execute: async (event, context) => {
            const { method, path } = getRouteDetails(event);
            const matchedRoute = matchRoute(router, path, method as Method);
            if (Object.keys(matchedRoute).length === 0) {
                return formatError(ROUTE_NOT_FOUND, 404);
            }
            const { callback, params, pathArray } = matchedRoute;
            const request = new Request(event, context, params);
            const response = new Response(event, context);
            const matchedMiddleware = matchMiddleware(pathArray, middleware);
            const stack = [...matchedMiddleware];

            stack.push(callback);
            try {
                return await handleRun(request, response, stack);
            } catch (err) {
                return formatError(err, 500);
            }
        },
        matchedRoute: event => {
            const { method, path } = getRouteDetails(event);
            return matchRoute(router, path, method as Method);
        },
    };
};

const handleRun = async (request: any, response: any, stack: Array<any>) => {
    // TODO: Fix this next() logic
    const next = () => ({});
    try {
        for (const fn of stack) {
            if (fn.length === 3) {
                await fn(request, response, next);
            } else {
                await fn(request, response);
            }
            if (response.isResponseSent) {
                return response.createResponse();
            }
        }
    } catch (error) {
        return formatError(error, 500);
    }
};

const formatError = (error: Error, statusCode: number) => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'text/plain',
            'x-amzn-ErrorType': statusCode,
        },
        isBase64Encoded: false,
        body: error.message,
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

const matchMiddleware = (
    pathArray: Array<string>,
    middlewareArray: Array<any>
): Array<any> => {
    const matchedMiddleware = [];
    middlewareArray.forEach(mw => {
        const { middleware, path } = mw;
        const middlewarePathArray = getPathArray(path);
        let match = true;

        for (const [index, fragment] of middlewarePathArray.entries()) {
            if (fragment === pathArray[index] || fragment === '*') {
                continue;
            }
            match = false;
            break;
        }
        if (match) {
            matchedMiddleware.push(middleware);
        }
    });

    return matchedMiddleware;
};

const equals = (array1: Array<string>, array2: Array<string>): boolean =>
    JSON.stringify(array1) === JSON.stringify(array2);

export { router };

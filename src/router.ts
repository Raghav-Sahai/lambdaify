import { Request } from './Request';
import { Response } from './Response';
import { ALBResult, ALBEvent, Context } from 'aws-lambda';
import { getParams, getPathArray } from './utils/parsePath';
import {
    ROUTE_ALREADY_EXISTS_ERROR,
    METHOD_PATH_EXTRACTION_ERROR,
    INVALID_MIDDLEWARE_PARAMS,
    INVALID_MIDDLEWARE_PARAMS_TYPE,
    INVALID_MIDDLEWARE_PARAMS_LENGTH,
    ROUTE_NOT_FOUND,
} from './errors';
import {
    Method,
    Route,
    Middleware,
    ErrorMiddleware,
    MiddlewareErrorFn,
    MiddlewareFn,
    REQUEST,
    RESPONSE,
} from './types/types';

const router = (options: object) => {
    const router: Array<Route> = [];
    const middleware: Array<Middleware> = [];
    const errorMiddleware: Array<ErrorMiddleware> = [];
    const defaultMiddleware: MiddlewareErrorFn = (error, req, res, next) => {
        return res
            .status(500)
            .header('Content-Type', 'application/json')
            .header('x-amzn-ErrorType', '500')
            .send({ error: error.message });
    };

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

                if (middlewareFn.length === 3) {
                    middleware.push({ middleware: middlewareFn, path });
                }
                if (middlewareFn.length === 4) {
                    errorMiddleware.push({ middleware: middlewareFn, path });
                }
            } else if (typeof args[0] === 'string') {
                const path = args[0];
                const middlewareFn = args[1];
                if (args.length > 2) {
                    throw INVALID_MIDDLEWARE_PARAMS_LENGTH(args, 2);
                }
                if (typeof middlewareFn !== 'function') {
                    throw INVALID_MIDDLEWARE_PARAMS_TYPE(
                        middlewareFn,
                        'second',
                        'function'
                    );
                }
                if (middlewareFn.length !== 3 && middlewareFn.length !== 4) {
                    throw INVALID_MIDDLEWARE_PARAMS(middlewareFn);
                }

                if (middlewareFn.length === 3) {
                    middleware.push({ middleware: middlewareFn, path });
                }
                if (middlewareFn.length === 4) {
                    errorMiddleware.push({ middleware: middlewareFn, path });
                }
            } else {
                throw INVALID_MIDDLEWARE_PARAMS_TYPE(
                    args[0],
                    'first',
                    'string or function'
                );
            }
            return { middleware, errorMiddleware };
        },
        execute: async (event: ALBEvent, context: Context) => {
            const { method, path } = getRouteDetails(event);
            const matchedRoute = matchRoute(router, path, method as Method);
            if (Object.keys(matchedRoute).length === 0) {
                return formatError(ROUTE_NOT_FOUND, 404);
            }
            const { callback, params, pathArray } = matchedRoute;
            const request: REQUEST = new Request(event, context, params);
            const response: RESPONSE = new Response(event, context);
            const matchedMiddleware = matchMiddleware(pathArray, middleware);
            const stack = [...matchedMiddleware];
            stack.push(callback);

            try {
                return await handleRun(request, response, stack);
            } catch (error) {
                const matchedErrorMiddleware = matchMiddleware(
                    pathArray,
                    errorMiddleware
                );
                const errorStack = [...matchedErrorMiddleware];
                errorStack.push(defaultMiddleware);
                return await handleError(error, request, response, errorStack);
            }
        },
        matchedRoute: (event: ALBEvent) => {
            const { method, path } = getRouteDetails(event);
            return matchRoute(router, path, method as Method);
        },
    };
};

const handleRun = async (
    request: REQUEST,
    response: RESPONSE,
    stack
): Promise<ALBResult> => {
    const next = () => ({});
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
};

const handleError = async (
    error: Error,
    request: REQUEST,
    response: RESPONSE,
    errorStack
): Promise<ALBResult> => {
    const next = () => ({});
    try {
        for (const fn of errorStack) {
            await fn(error, request, response, next);
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

const getRouteDetails = (event: any) => {
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
    middlewareArray: Array<Middleware> | Array<ErrorMiddleware>
): Array<MiddlewareFn> | Array<MiddlewareErrorFn> => {
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

const equals = (array1: Array<string>, array2: Array<string>) =>
    JSON.stringify(array1) === JSON.stringify(array2);

export { router };

interface Param {
    key: string;
    index: number;
}
interface Route {
    method: Method;
    path: string;
    pathArray: Array<string>;
    params: Array<Param>;
    callback;
}
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

type MiddlewareFn = (req: any, res: any, next: any) => any;
type MiddlewareErrorFn = (error: Error, req: any, res: any, next: any) => any;

interface Middleware {
    middleware: MiddlewareFn;
    path: string;
}

interface ErrorMiddleware {
    middleware: MiddlewareErrorFn;
    path: string;
}

export {
    Param,
    Route,
    Method,
    Middleware,
    ErrorMiddleware,
    MiddlewareFn,
    MiddlewareErrorFn,
};

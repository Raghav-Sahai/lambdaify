import { ALBEvent, Context, ALBResult } from 'aws-lambda';

interface Param {
    key: string;
    index: number;
}
interface Route {
    method: Method;
    path: string;
    pathArray: Array<string>;
    params: Array<Param>;
    callback: Callback;
}
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';
type Callback = (req: REQUEST, res: RESPONSE) => void | any | Promise<any>;
type MiddlewareFn = (
    req: REQUEST,
    res: RESPONSE,
    next: () => void
) => void | any | Promise<any>;
type MiddlewareErrorFn = (
    error: Error,
    req: REQUEST,
    res: RESPONSE,
    next: () => void
) => any;

interface Middleware {
    middleware: MiddlewareFn;
    path: string;
}

interface ErrorMiddleware {
    middleware: MiddlewareErrorFn;
    path: string;
}

interface REQUEST {
    event: ALBEvent;
    context: Context;
    paramsMap: Array<Param>;
    req: ALBEvent;
    raw: ALBEvent;
    method: Method;
    path: string;
    body: any;
    isBase64Encoded: boolean;
    headers: {
        [key: string]: string | undefined;
    };
    queryStringParameters: {
        [key: string]: string | undefined;
    };
    params: {
        [key: string]: string | undefined;
    };
}

interface RESPONSE {
    event: ALBEvent;
    context: Context;
    isResponseSent: boolean;
    isBase64Encoded: boolean;
    body: any;
    serializer: any;
    headers: {
        [key: string]: string | undefined;
    };
    statusCode: number;
    cookies: Array<string>;
    createResponse: () => ALBResult;
    send: (body: any) => RESPONSE;
    cookie: (cooke: string) => RESPONSE;
    header: (key: string, value: string) => RESPONSE;
    setHeader: (key: string, value: string) => RESPONSE;
    setSerializer: (serializerFn: any) => RESPONSE;
    code: (code: number) => RESPONSE;
    status: (code: number) => RESPONSE;
    encodeBase64: () => RESPONSE;
}

export {
    Param,
    Route,
    Method,
    Middleware,
    ErrorMiddleware,
    MiddlewareFn,
    MiddlewareErrorFn,
    REQUEST,
    RESPONSE,
    Callback,
};

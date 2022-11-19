import { Param, Method } from './router.types';

export interface Request {
    event: any;
    context: any;
    paramsMap: Array<Param>;
    req: () => any;
    raw: () => any;
    method: () => Method;
    path: () => string;
    queryStringParameters: () => object;
    headers: () => object;
    body: () => any;
    isBase64Encoded: () => boolean;
    params: () => object;
}

export interface RequestConstructor {
    new (name: string): Request;
    (): void;
}

import { Param } from './types/types';
import { getPathArray } from './utils/parsePath';
import { decodeBase64 } from './utils/base64';

function Request(event, context, paramsMap: Array<Param>) {
    this.event = event;
    this.context = context;
    this.paramsMap = paramsMap;
}

Object.defineProperties(Request.prototype, {
    req: {
        get() {
            return this.event;
        },
    },
    raw: {
        get() {
            return this.event;
        },
    },
    method: {
        get(): string {
            return this.event.httpMethod;
        },
    },
    path: {
        get(): string {
            return this.event.path;
        },
    },
    queryStringParameters: {
        get() {
            return this.event.queryStringParameters;
        },
    },
    headers: {
        get() {
            return this.event.headers;
        },
    },
    body: {
        get() {
            if (this.event.isBase64Encoded) {
                return decodeBase64(this.event.body);
            }
            return this.event.body;
        },
    },
    isBase64Encoded: {
        get(): boolean {
            return this.event.isBase64Encoded;
        },
    },
    params: {
        get(): object {
            return parseParams(this.event.path, this.paramsMap);
        },
    },
});

const parseParams = (path: string, params: Array<Param>): object => {
    if (params.length === 0) return {};

    const _params = {};
    const pathArray = getPathArray(path);

    params.forEach(param => (_params[param.key] = pathArray[param.index]));

    return _params;
};

export { Request };

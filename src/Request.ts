import { StandardizedEvent, StandardizedContext } from './utils/standardize';
import { Param } from './types/router.types';
import { getPathArray } from './utils/parsePath';

function Request(
    event: StandardizedEvent,
    context: StandardizedContext,
    paramsMap: Array<Param>
) {
    this.event = event;
    this.context = context;
    this.paramsMap = paramsMap;
}

Object.defineProperties(Request.prototype, {
    req: {
        get(): StandardizedEvent {
            return this.event;
        },
    },
    raw: {
        get() {
            return this.event.raw;
        },
    },
    version: {
        get(): string {
            return this.event.payloadVersion;
        },
    },
    body: {
        get() {
            return this.event.body;
        },
    },
    headers: {
        get() {
            return this.event.headers;
        },
    },
    path: {
        get(): string {
            return this.event.path;
        },
    },
    method: {
        get(): string {
            return this.event.method;
        },
    },
    isBase64Encoded: {
        get(): boolean {
            return this.event.isBase64Encoded;
        },
    },
    querystringParameters: {
        get() {
            return this.event.querystringParameters;
        },
    },
    params: {
        get(): object {
            return parseParams(this.event.path, this.paramsMap);
        },
    },
});

const parseParams = (path: string, params: Array<Param>): object => {
    // If no params, return empty object
    if (params.length === 0) return {};

    const _params = {};
    const pathArray = getPathArray(path);

    params.forEach(param => (_params[param.key] = pathArray[param.index]));

    return _params;
};

export { Request };

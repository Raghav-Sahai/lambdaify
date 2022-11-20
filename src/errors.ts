import { Method } from './types/types';

/**
 * Router Errors
 */
const ROUTE_ALREADY_EXISTS_ERROR = (method: Method, path: string) =>
    new Error(
        `${method} ${path} already exists and cannot be registered again.`
    );
const METHOD_PATH_EXTRACTION_ERROR = new Error(
    'Failed to parse event for method and path. Make sure your eventSource is set application load balancer'
);
const INVALID_MIDDLEWARE_PARAMS = (param: Array<any>) =>
    new Error(
        `Failed to register middleware: function must contain either 3 or 4 parameters, received ${param.length}`
    );
const INVALID_MIDDLEWARE_PARAMS_TYPE = (
    param: any,
    index: string,
    expected: string
) =>
    new Error(
        `Failed to register middleware: ${index} param must be of type ${expected}, received ${typeof param}`
    );
const INVALID_MIDDLEWARE_PARAMS_LENGTH = (
    param: Array<any>,
    expectedLength: number
) =>
    new Error(
        `Failed to register middleware: expected ${expectedLength} params, received ${param.length}`
    );
const ROUTE_NOT_FOUND = new Error('Resource not found');

/**
 * Response Errors
 */
const RESPONSE_ALREADY_SENT = new Error(
    'Response Error: Response was already sent'
);
const CODE_ERROR = new Error('Lambdaify Error: Invalid status code');
const SERIALIZER_MUST_BE_FUNCTION = new Error(
    'Response Error: Serializer must be of type function'
);
const COOKIE_MUST_BE_STRING = new Error(
    'Response Error: Cookie must be of type string'
);
const INVALID_HEADER_PARAMS = new Error(
    'Response Error: req.header must be called with two params, key and value'
);

export {
    ROUTE_ALREADY_EXISTS_ERROR,
    METHOD_PATH_EXTRACTION_ERROR,
    INVALID_MIDDLEWARE_PARAMS,
    INVALID_MIDDLEWARE_PARAMS_TYPE,
    INVALID_MIDDLEWARE_PARAMS_LENGTH,
    ROUTE_NOT_FOUND,
    RESPONSE_ALREADY_SENT,
    CODE_ERROR,
    SERIALIZER_MUST_BE_FUNCTION,
    COOKIE_MUST_BE_STRING,
    INVALID_HEADER_PARAMS,
};

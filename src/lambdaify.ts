import { Route, Param } from './types/router.types';
import { Request } from './Request';
import { Response } from './Response';
import { router } from './Router';

const ROUTE_NOT_FOUND = new Error('Resource not found');
const UNEXPECTED_ERROR = new Error('Unexpected error');
const LAMBDAIFY_OPTIONS_ERROR = new Error(
    'Lambdaify options must be an object'
);

const lambdaify = options => {
    options = options || {};
    if (typeof options !== 'object') {
        throw LAMBDAIFY_OPTIONS_ERROR;
    }

    const Router = router({});

    const lambdaify = {
        run: async (event, context) => {
            const matchedRoute: Route = Router.matchedRoute(event);
            if (Object.keys(matchedRoute).length === 0) {
                console.log('HERE');
                return formatError(ROUTE_NOT_FOUND, 404);
            }

            const { callback, params } = matchedRoute;
            try {
                return await handleRun(event, context, callback, params);
            } catch (err) {
                return formatError(UNEXPECTED_ERROR, 500);
            }
        },
        get: (path: string, callback) =>
            Router.registerRoute('GET', path, callback),
        put: (path: string, callback) =>
            Router.registerRoute('PUT', path, callback),
        post: (path: string, callback) =>
            Router.registerRoute('POST', path, callback),
        delete: (path: string, callback) =>
            Router.registerRoute('DELETE', path, callback),
    };

    return lambdaify;
};

const handleRun = async (
    event: any,
    context: any,
    callback: any,
    params: Array<Param>
) => {
    const request = new Request(event, context, params);
    const response = new Response(event, context);

    try {
        await callback(request, response);
        return response.createResponse();
    } catch (err) {
        return formatError(err, 500);
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

export { lambdaify };
module.exports = lambdaify;
module.exports.lambdaify = lambdaify;
module.exports.default = lambdaify;

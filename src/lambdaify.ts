import { Route, Param } from './types/router.types';
import { Request } from './Request';
import { Response } from './Response';
import { router } from './Router';

const ROUTE_NOT_FOUND = new Error('Resource not found');

const lambdaify = () => {
    const Router = router({});

    const lambdaify = {
        run: async (event, context) => {
            const matchedRoute: Route = Router.matchedRoute(event);
            if (Object.keys(matchedRoute).length === 0) {
                return formatError(ROUTE_NOT_FOUND, 404);
            }
            const { callback, params } = matchedRoute;

            const request = new Request(event, context, params);
            const response = new Response(event, context);
            try {
                return await handleRun(request, response, callback);
            } catch (err) {
                return formatError(err, 500);
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
    request: any,
    response: any,
    callback: any
) => {
    try {
        await callback(request, response);
        return response.createResponse();
    } catch (error) {
        throw error;
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

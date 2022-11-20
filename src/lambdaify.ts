import { router } from './Router';
import { Callback } from './types/types';
import { ALBEvent, Context } from 'aws-lambda';

const lambdaify = options => {
    const Router = router({});

    const lambdaify = {
        run: async (event: ALBEvent, context: Context) => {
            return await Router.execute(event, context);
        },
        use: (...middleware: any) => {
            Router.registerMiddleware(...middleware);
        },
        get: (path: string, callback: Callback) =>
            Router.registerRoute('GET', path, callback),
        put: (path: string, callback: Callback) =>
            Router.registerRoute('PUT', path, callback),
        post: (path: string, callback: Callback) =>
            Router.registerRoute('POST', path, callback),
        delete: (path: string, callback: Callback) =>
            Router.registerRoute('DELETE', path, callback),
    };

    return lambdaify;
};

export { lambdaify };
module.exports = lambdaify;
module.exports.lambdaify = lambdaify;
module.exports.default = lambdaify;

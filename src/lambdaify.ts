import { router } from './Router';

const lambdaify = () => {
    const Router = router({});

    const lambdaify = {
        run: async (event, context) => {
            return await Router.execute(event, context);
        },
        use: middleware => {
            Router.registerMiddleware(middleware);
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

export { lambdaify };
module.exports = lambdaify;
module.exports.lambdaify = lambdaify;
module.exports.default = lambdaify;

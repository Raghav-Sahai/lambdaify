import lambdaify from '../../src/lambdaify';
import albEvent from '../fixtures/albEvent.json';

describe('Functional unit tests?', () => {
    let app;
    beforeEach(() => {
        app = lambdaify();
        app.get('/', (req, res) => {
            return res
                .header('key', 'value')
                .header('key2', 'value2')
                .status(201)
                .send({
                    body: req.body,
                    headers: req.headers,
                    path: req.path,
                    method: req.method,
                    isBase64Encoded: req.isBase64Encoded,
                    queryStringParameters: req.queryStringParameters,
                    params: req.params,
                });
        });
        app.post('/test/path', (req, res) => {
            return res
                .header('key', 'value')
                .header('key2', 'value2')
                .code(200)
                .send({
                    body: req.body,
                    headers: req.headers,
                    path: req.path,
                    method: req.method,
                    isBase64Encoded: req.isBase64Encoded,
                    queryStringParameters: req.queryStringParameters,
                    params: req.params,
                });
        });
        app.put('/test/path/:id', (req, res) => {
            return res
                .header('key', 'value')
                .header('key2', 'value2')
                .code(400)
                .send({
                    body: req.body,
                    headers: req.headers,
                    path: req.path,
                    method: req.method,
                    isBase64Encoded: req.isBase64Encoded,
                    queryStringParameters: req.queryStringParameters,
                    params: req.params,
                });
        });
        app.delete('/test/path/:id/:deleteId', (req, res) => {
            return res
                .header('key', 'value')
                .header('key2', 'value2')
                .code(200)
                .send({
                    body: req.body,
                    headers: req.headers,
                    path: req.path,
                    method: req.method,
                    isBase64Encoded: req.isBase64Encoded,
                    queryStringParameters: req.queryStringParameters,
                    params: req.params,
                });
        });
        app.post('/base64/test', (req, res) => {
            return res
                .header('key', 'value')
                .header('key2', 'value2')
                .code(200)
                .send({
                    body: req.body,
                    headers: req.headers,
                    path: req.path,
                    method: req.method,
                    isBase64Encoded: req.isBase64Encoded,
                    queryStringParameters: req.queryStringParameters,
                    params: req.params,
                });
        });
        app.post('/base64/test/2', (req, res) => {
            return res
                .header('key', 'value')
                .header('key2', 'value2')
                .code(200)
                .encodeBase64()
                .send({
                    body: req.body,
                    headers: req.headers,
                    path: req.path,
                    method: req.method,
                    isBase64Encoded: req.isBase64Encoded,
                    queryStringParameters: req.queryStringParameters,
                    params: req.params,
                });
        });
    });
    describe('Happy Paths', () => {
        describe('When app.run is called with an alb event to an existing route (/)', () => {
            it('then the correct response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/',
                    headers: { accept: 'application/json' },
                    queryStringParameters: { query: '1234' },
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: '{"body":"Hello from alb!","headers":{"accept":"application/json"},"path":"/","method":"GET","isBase64Encoded":false,"queryStringParameters":{"query":"1234"},"params":{}}',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                    },
                    isBase64Encoded: false,
                    statusCode: 201,
                    statusDescription: 'Created',
                });
            });
        });
        describe('When app.run is called with an alb event to an existing route (/test/path)', () => {
            it('then the correct response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'POST',
                    path: '/test/path',
                    headers: { accept: 'application/json' },
                    queryStringParameters: { query: '1234', query2: '12345' },
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: '{"body":"Hello from alb!","headers":{"accept":"application/json"},"path":"/test/path","method":"POST","isBase64Encoded":false,"queryStringParameters":{"query":"1234","query2":"12345"},"params":{}}',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                    },
                    isBase64Encoded: false,
                    statusCode: 200,
                    statusDescription: 'OK',
                });
            });
        });
        describe('When app.run is called with an alb event to an existing route (/test/path/:id)', () => {
            it('then the correct response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'PUT',
                    path: '/test/path/1234',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: '{"body":"Hello from alb!","headers":{"accept":"application/json"},"path":"/test/path/1234","method":"PUT","isBase64Encoded":false,"queryStringParameters":{},"params":{"id":"1234"}}',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                    },
                    isBase64Encoded: false,
                    statusCode: 400,
                    statusDescription: 'Bad Request',
                });
            });
        });
        describe('When app.run is called with an alb event to an existing route (/test/path/:id/:deleteId)', () => {
            it('then the correct response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'DELETE',
                    path: '/test/path/1234/12345',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: '{"body":"Hello from alb!","headers":{"accept":"application/json"},"path":"/test/path/1234/12345","method":"DELETE","isBase64Encoded":false,"queryStringParameters":{},"params":{"id":"1234","deleteId":"12345"}}',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                    },
                    isBase64Encoded: false,
                    statusCode: 200,
                    statusDescription: 'OK',
                });
            });
        });
        describe('When app.run is called with an alb event to an existing route (/base64/test)', () => {
            it('then the correct response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'POST',
                    path: '/base64/test',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                    body: 'SGVsbG8gd29ybGQ=',
                    isBase64Encoded: true,
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: '{"body":"Hello world","headers":{"accept":"application/json"},"path":"/base64/test","method":"POST","isBase64Encoded":true,"queryStringParameters":{},"params":{}}',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                    },
                    isBase64Encoded: false,
                    statusCode: 200,
                    statusDescription: 'OK',
                });
            });
        });
        describe('When app.run is called with an alb event to an existing route (/base64/test/2)', () => {
            it('then the correct response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'POST',
                    path: '/base64/test/2',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                    body: 'SGVsbG8gd29ybGQ=',
                    isBase64Encoded: true,
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'eyJib2R5IjoiSGVsbG8gd29ybGQiLCJoZWFkZXJzIjp7ImFjY2VwdCI6ImFwcGxpY2F0aW9uL2pzb24ifSwicGF0aCI6Ii9iYXNlNjQvdGVzdC8yIiwibWV0aG9kIjoiUE9TVCIsImlzQmFzZTY0RW5jb2RlZCI6dHJ1ZSwicXVlcnlTdHJpbmdQYXJhbWV0ZXJzIjp7fSwicGFyYW1zIjp7fX0=',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                    },
                    isBase64Encoded: true,
                    statusCode: 200,
                    statusDescription: 'OK',
                });
            });
        });
        describe('When app.run is called with a middleware that sends a response directly', () => {
            it('then the correct response is returned', async () => {
                const middleware = (req, res, next) => {
                    return res
                        .header('middlewareKey', 'middlewareValue')
                        .send('Middleware1 body');
                };
                app.use(middleware);
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/',
                    headers: { accept: 'application/json' },
                    queryStringParameters: { query: '1234' },
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'Middleware1 body',
                    headers: {
                        middlewarekey: 'middlewareValue',
                    },
                    isBase64Encoded: false,
                    statusCode: 200,
                    statusDescription: 'OK',
                });
            });
        });
        describe('When app.run is called with two middleware and the first one sends a response directly', () => {
            it('then the correct response is returned', async () => {
                const middleware = (req, res, next) => {
                    return res
                        .header('middlewareKey', 'middlewareValue')
                        .send('Middleware1 body');
                };
                const middleware2 = (req, res, next) => {
                    return res
                        .header('middlewareKey2', 'middlewareValue2')
                        .send('Middleware2 body');
                };
                app.use(middleware);
                app.use(middleware2);
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/',
                    headers: { accept: 'application/json' },
                    queryStringParameters: { query: '1234' },
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'Middleware1 body',
                    headers: {
                        middlewarekey: 'middlewareValue',
                    },
                    isBase64Encoded: false,
                    statusCode: 200,
                    statusDescription: 'OK',
                });
            });
        });
        describe('When app.run is called with a middleware that calls next()', () => {
            it('then the correct response is returned', async () => {
                const middleware = (req, res, next) => {
                    res.header('middlewareKey', 'middlewareValue');
                    next();
                };
                app.use(middleware);
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/',
                    headers: { accept: 'application/json' },
                    queryStringParameters: { query: '1234' },
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: '{"body":"Hello from alb!","headers":{"accept":"application/json"},"path":"/","method":"GET","isBase64Encoded":false,"queryStringParameters":{"query":"1234"},"params":{}}',
                    headers: {
                        key: 'value',
                        key2: 'value2',
                        middlewarekey: 'middlewareValue',
                    },
                    isBase64Encoded: false,
                    statusCode: 201,
                    statusDescription: 'Created',
                });
            });
        });
    });
    describe('Error Paths', () => {
        describe('When a duplicate route is being added to app', () => {
            it('Then an error is thrown', () => {
                expect(() => app.get('/', () => 'test')).toThrow(
                    'GET / already exists and cannot be registered again.'
                );
            });
        });
        describe('When app.run is called with an alb event and there is no matching route', () => {
            it('then a 404 route not found response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/imaginaryRoute',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'Resource not found',
                    headers: {
                        'Content-Type': 'text/plain',
                        'x-amzn-ErrorType': 404,
                    },
                    isBase64Encoded: false,
                    statusCode: 404,
                });
            });
        });
        describe('When app.run is called with an alb event and there is no matching route for the exact httpVerb', () => {
            it('then a 404 route not found response is returned', async () => {
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/test/path',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'Resource not found',
                    headers: {
                        'Content-Type': 'text/plain',
                        'x-amzn-ErrorType': 404,
                    },
                    isBase64Encoded: false,
                    statusCode: 404,
                });
            });
        });
        describe('When the request parameter is called with a method that does not exist', () => {
            it('Then an error response returned', async () => {
                app.get('/requestErrorCase', (req, _) => req.notRealProperty());
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/requestErrorCase',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'req.notRealProperty is not a function',
                    headers: {
                        'Content-Type': 'text/plain',
                        'x-amzn-ErrorType': 500,
                    },
                    isBase64Encoded: false,
                    statusCode: 500,
                });
            });
        });
        describe('When the response parameter is called with a method that does not exist', () => {
            it('Then an error response returned', async () => {
                app.get('/responseErrorCase', (_, res) =>
                    res.notRealProperty()
                );
                const testAlbEvent = {
                    ...albEvent,
                    httpMethod: 'GET',
                    path: '/responseErrorCase',
                    headers: { accept: 'application/json' },
                    queryStringParameters: {},
                };
                const response = await app.run(testAlbEvent, {});
                expect(response).toStrictEqual({
                    body: 'res.notRealProperty is not a function',
                    headers: {
                        'Content-Type': 'text/plain',
                        'x-amzn-ErrorType': 500,
                    },
                    isBase64Encoded: false,
                    statusCode: 500,
                });
            });
        });
        describe('When an invalid middleware is registered', () => {
            it('Then an error is thrown', () => {
                expect(() =>
                    app.use((req, res) => {
                        return 'middleware';
                    })
                ).toThrow(
                    'Middlewares must contain 3 parameters (request, response, next)'
                );
            });
        });
    });
});

const lambdaify = require('../../src/lambdaify')();
const albEvent = require('../fixtures/albEvent.json');

lambdaify.get('/', (req, res) => {
    return res
        .header('key', 'value')
        .header('key', ['value1', 'value2'])
        .status(201)
        .send({
            version: req.version,
            body: req.body,
            headers: req.headers,
            path: req.path,
            method: req.method,
            isBase64Encoded: req.isBase64Encoded,
            queryStringParameters: req.queryStringParameters,
            params: req.params,
        });
});
lambdaify.get('/test/path', (req, res) => {
    return res
        .header('key', 'value')
        .header('key', ['value1', 'value2'])
        .code(201)
        .send({
            version: req.version,
            body: req.body,
            headers: req.headers,
            path: req.path,
            method: req.method,
            isBase64Encoded: req.isBase64Encoded,
            queryStringParameters: req.queryStringParameters,
            params: req.params,
        });
});
lambdaify.put('/test/path/:id', (req, res) => {
    return res
        .header('key', 'value')
        .header('key', ['value1', 'value2'])
        .code(201)
        .send({
            version: req.version,
            body: req.body,
            headers: req.headers,
            path: req.path,
            method: req.method,
            isBase64Encoded: req.isBase64Encoded,
            queryStringParameters: req.queryStringParameters,
            params: req.params,
            paramId: req.params.id,
        });
});

// describe('When lambdaify.run is called with an alb event', () => {
//     it('then the correct response is returned', async () => {
//         const testAlbEvent = {
//             ...albEvent,
//             method: 'GET',
//             path: '/test/path',
//             headers: { accept: 'application/json' },
//         };
//         const response = await lambdaify.run(testAlbEvent, {});
//         expect(response).toStrictEqual({});
//     });
// });

const lambdaify = require('../lib/lambdaify')();

const event = {
    httpMethod: 'GET',
    path: '/get/1234',
    body: 'event body',
    headers: {
        header: 'testHeader',
    },
    queryStringParameters: '',
    requestContext: {
        elb: {
            targetGroupArn: 'test',
        },
    },
};
const context = {};
// lambdaify.get('/', (req, res) => {
//     res.send({ hello: 'world' })
// })

// exports.handler = async (event, context) => {
//     return await lambdaify.run(event, context);
// };

lambdaify.get('/get/:id', (req, res) => {
    console.log('example::get');
    console.log('req.body: ', req.body);
    console.log('req.headers: ', req.headers);
    console.log('req.params: ', req.params);
    res.header('headerKey', 'headerValue');
    return res.send('test body').code(400);
});
// lambdaify.router()
const run = async () => {
    const response = await lambdaify.run(event, context);
    console.log('example::response', response);
};

run();

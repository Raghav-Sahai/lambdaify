const lambdaify = require('../lib/lambdaify')();
const { performance } = require('perf_hooks');

const event = {
    httpMethod: 'POST',
    path: '/get/1234',
    body: 'event body',
    headers: {
        header: 'testHeader',
    },
    queryStringParameters: {},
    requestContext: {
        elb: {
            targetGroupArn: 'test',
        },
    },
};
const context = {};

lambdaify.get('/get/:id', (req, res) => {
    res.header('headerKey', 'headerValue');
    return res.send(req.params).code(400);
});

const run = async () => {
    const lambdaifyStart = performance.now();
    const response = await lambdaify.run(event, context);
    const lambdaifyEnd = performance.now();
    console.log(
        `example::run(::Execution time: ${lambdaifyEnd - lambdaifyStart} ms`
    );
    console.log('example::response', response);
};

run();

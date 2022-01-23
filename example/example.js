const lambdaify = require('../lib/lambdaify')()


const event = {
    httpMethod: 'GET',
    path: '/get',
    body: 'event body',
    headers: {
        'header': 'testHeader'
    },
    queryStringParameters: '',
    requestContext: {
        elb: {
            targetGroupArn: 'test'
        }
    }
}
const context = {}
// lambdaify.get('/', (req, res) => {
//     res.send({ hello: 'world' })
// })

// exports.handler = async (event, context) => {
//     return await lambdaify.run(event, context);
// };

lambdaify.get('/get', (req, res) => {
    console.log('example::get')
    console.log('req.body', req.body)
    console.log('req.headers', req.headers)
    return res.send({body: 'test body'})
})
// lambdaify.router()
lambdaify.run(event, context)
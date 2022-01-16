const lambdaify = require('../lib/lambdaify')()

// lambdaify.get('/', (req, res) => {
//     res.send({ hello: 'world' })
// })

// exports.handler = async (event, context) => {
//     return await lambdaify.run(event, context);
// };

lambdaify.run()
lambdaify.put()
lambdaify.get()